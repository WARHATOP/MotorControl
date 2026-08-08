import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react';
import type { LogicNode } from '../logic';

/** Переключатель: клик по черепу меняет сигнал на выходе. */
export default function ButtonNode({ id, data }: NodeProps<LogicNode>) {
  const { updateNodeData } = useReactFlow();
  const on = data.on === true;

  return (
    <div className={`hw-node hw-button ${on ? 'is-on' : ''}`}>
      <div className="hw-node__title">{data.label}</div>

      <button
        type="button"
        className="hw-switch nodrag"
        onClick={() => updateNodeData(id, { on: !on })}
        aria-pressed={on}
      >
        <span className="hw-switch__icon">{on ? '💀' : '🪦'}</span>
        <span className="hw-switch__state">{on ? 'ВКЛ' : 'ВЫКЛ'}</span>
      </button>

      <Handle type="source" position={Position.Right} id="out" className="hw-handle" />
    </div>
  );
}
