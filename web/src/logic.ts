import type { Edge, Node } from '@xyflow/react';

export type LogicKind = 'button' | 'or' | 'lamp';

export type LogicNodeData = {
  label: string;
  /** Состояние переключателя — используется только узлами типа `button`. */
  on?: boolean;
  /** Вычисленное значение на выходе узла (для лампы — значение на входе). */
  value?: boolean;
};

export type LogicNode = Node<LogicNodeData, LogicKind>;
export type LogicEdge = Edge;

/**
 * Считает значения всех узлов схемы.
 *
 * Схема может быть собрана пользователем как угодно, поэтому вместо
 * топологической сортировки используется итеративная релаксация: значения
 * пересчитываются до стабилизации, но не больше `nodes.length + 1` проходов.
 * Для ациклической схемы этого всегда достаточно, а цикл (обратная связь)
 * просто не подвесит вычисление.
 */
export function evaluate(nodes: LogicNode[], edges: LogicEdge[]): Map<string, boolean> {
  const values = new Map<string, boolean>();
  const incoming = new Map<string, string[]>();

  for (const node of nodes) {
    values.set(node.id, node.type === 'button' ? node.data.on === true : false);
    incoming.set(node.id, []);
  }
  for (const edge of edges) {
    incoming.get(edge.target)?.push(edge.source);
  }

  for (let pass = 0; pass <= nodes.length; pass++) {
    let changed = false;

    for (const node of nodes) {
      if (node.type === 'button') continue;

      // И «ИЛИ», и лампа зажигаются от любого истинного входа.
      const next = incoming.get(node.id)!.some((sourceId) => values.get(sourceId) === true);
      if (next !== values.get(node.id)) {
        values.set(node.id, next);
        changed = true;
      }
    }

    if (!changed) break;
  }

  return values;
}
