import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { LogicNode } from '../logic';

/** Лампочка-тыква: светится, когда на входе единица. */
export default function LampNode({ data }: NodeProps<LogicNode>) {
  const on = data.value === true;

  return (
    <div className={`hw-node hw-lamp ${on ? 'is-on' : ''}`}>
      <div className="hw-node__title">{data.label}</div>

      <div className="hw-lamp__glass">
        <span className="hw-lamp__pumpkin">🎃</span>
      </div>
      <div className="hw-lamp__state">{on ? 'ГОРИТ' : 'ПОГАСЛА'}</div>

      <Handle type="target" position={Position.Left} id="in" className="hw-handle" />
    </div>
  );
}
