import { useCallback, useMemo, useRef } from 'react';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type IsValidConnection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ButtonNode from './nodes/ButtonNode';
import OrNode from './nodes/OrNode';
import LampNode from './nodes/LampNode';
import { evaluate, type LogicEdge, type LogicKind, type LogicNode } from './logic';

const nodeTypes = {
  button: ButtonNode,
  or: OrNode,
  lamp: LampNode,
};

const initialNodes: LogicNode[] = [
  { id: 'btn-1', type: 'button', position: { x: 0, y: 40 }, data: { label: 'Ведьма', on: false } },
  { id: 'btn-2', type: 'button', position: { x: 0, y: 240 }, data: { label: 'Призрак', on: false } },
  { id: 'or-1', type: 'or', position: { x: 280, y: 130 }, data: { label: 'ИЛИ' } },
  { id: 'lamp-1', type: 'lamp', position: { x: 540, y: 120 }, data: { label: 'Фонарь Джека' } },
];

const initialEdges: LogicEdge[] = [
  { id: 'e1', source: 'btn-1', sourceHandle: 'out', target: 'or-1', targetHandle: 'a' },
  { id: 'e2', source: 'btn-2', sourceHandle: 'out', target: 'or-1', targetHandle: 'b' },
  { id: 'e3', source: 'or-1', sourceHandle: 'out', target: 'lamp-1', targetHandle: 'in' },
];

/** Ширина, ниже которой раскладка считается телефонной. */
const NARROW_SCREEN = 720;

/**
 * Панель и мини-карта висят поверх холста, поэтому `fitView` должен оставить
 * им место. На телефоне панель занимает всю ширину и уходит наверх, а
 * мини-карта прячется — отступы соответственно другие.
 */
function fitViewPadding() {
  return window.innerWidth < NARROW_SCREEN
    ? ({ top: '190px', right: '16px', bottom: '80px', left: '16px' } as const)
    : ({ top: '40px', right: '60px', bottom: '160px', left: '300px' } as const);
}

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<LogicNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<LogicEdge>(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const nextId = useRef(1);

  const values = useMemo(() => evaluate(nodes, edges), [nodes, edges]);

  // Значения — производные от схемы, поэтому подмешиваются к узлам и рёбрам
  // на отрисовке, а не хранятся в состоянии.
  const viewNodes = useMemo<LogicNode[]>(
    () => nodes.map((node) => ({ ...node, data: { ...node.data, value: values.get(node.id) === true } })),
    [nodes, values],
  );

  const viewEdges = useMemo<LogicEdge[]>(
    () =>
      edges.map((edge) => {
        const live = values.get(edge.source) === true;
        return {
          ...edge,
          animated: live,
          style: { stroke: live ? '#ff8a1f' : '#4a3b63', strokeWidth: live ? 3 : 2 },
        };
      }),
    [edges, values],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((current) => addEdge(connection, current)),
    [setEdges],
  );

  const isValidConnection = useCallback<IsValidConnection<LogicEdge>>(
    (connection) => connection.source !== connection.target,
    [],
  );

  const addNode = useCallback(
    (kind: LogicKind, label: string) => {
      const id = `${kind}-${Date.now().toString(36)}-${nextId.current++}`;
      const position = screenToFlowPosition({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 160,
      });
      setNodes((current) => [
        ...current,
        { id, type: kind, position, data: kind === 'button' ? { label, on: false } : { label } },
      ]);
    },
    [screenToFlowPosition, setNodes],
  );

  const reset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const lampsOn = viewNodes.filter((node) => node.type === 'lamp' && node.data.value).length;

  return (
    <ReactFlow
      nodes={viewNodes}
      edges={viewEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      fitView
      fitViewOptions={{ padding: fitViewPadding() }}
      proOptions={{ hideAttribution: false }}
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1.6} color="#4b2f6b" />
      <Controls />
      <MiniMap pannable zoomable maskColor="rgba(10, 6, 20, 0.75)" nodeColor="#ff8a1f" />

      <Panel position="top-left" className="hw-panel">
        <div className="hw-panel__title">🎃 Halloween Logic</div>
        <p className="hw-panel__hint">
          Жми на надгробия, тяни связи от кружков. Фонарь загорается, если хотя бы один вход горит.
        </p>
        <div className="hw-panel__row">
          <button type="button" onClick={() => addNode('button', 'Кнопка')}>
            + кнопка
          </button>
          <button type="button" onClick={() => addNode('or', 'ИЛИ')}>
            + ИЛИ
          </button>
          <button type="button" onClick={() => addNode('lamp', 'Фонарь')}>
            + лампа
          </button>
          <button type="button" onClick={reset}>
            сброс
          </button>
        </div>
        <div className="hw-panel__status">
          Горит фонарей: <b>{lampsOn}</b>
        </div>
      </Panel>
    </ReactFlow>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
