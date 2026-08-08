import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { LogicNode } from '../logic';

/** Логическое «ИЛИ»: два входа слева, выход справа. */
export default function OrNode({ data }: NodeProps<LogicNode>) {
  const on = data.value === true;

  return (
    <div className={`hw-node hw-or ${on ? 'is-on' : ''}`}>
      <div className="hw-node__title">{data.label}</div>

      <div className="hw-or__body">
        <span className="hw-or__sign">≥1</span>
        <span className="hw-or__caption">OR</span>
      </div>

      <Handle type="target" position={Position.Left} id="a" className="hw-handle" style={{ top: '38%' }} />
      <Handle type="target" position={Position.Left} id="b" className="hw-handle" style={{ top: '72%' }} />
      <Handle type="source" position={Position.Right} id="out" className="hw-handle" />
    </div>
  );
}
