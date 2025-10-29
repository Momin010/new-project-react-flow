import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextNode from '../components/TextNode';

// Initial node to get the user started
const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'textNode',
    position: { x: 250, y: 5 }, 
    data: { label: 'Central Idea' } 
  },
];

// Helper to get a unique ID for new nodes
let id = 2;
const getId = () => `${id++}`;

const MindMapPage: React.FC = () => {
  // Register our custom node type
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
    [setEdges],
  );

  const onAddNode = useCallback(() => {
    const newNode: Node = {
      id: getId(),
      type: 'textNode',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: { label: 'New Topic' },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);
  
  // This function handles changes to the text inside a node
  const onNodeLabelChange = (nodeId: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Create a new object to ensure React detects the change
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      })
    );
  };

  const onSave = useCallback(() => {
    const flow = { nodes, edges };
    localStorage.setItem('mindmap-flow', JSON.stringify(flow));
    alert('Mind map saved!');
  }, [nodes, edges]);

  const onRestore = useCallback(() => {
    const flowString = localStorage.getItem('mindmap-flow');
    if (flowString) {
      const flow = JSON.parse(flowString);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      // Make sure the next new node ID is unique
      const maxId = flow.nodes.reduce((max: number, node: Node) => Math.max(max, parseInt(node.id, 10)), 0);
      id = maxId + 1;
    } else {
        alert('No saved mind map found.');
    }
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="absolute top-4 left-4 z-10 space-x-2">
        <button onClick={onAddNode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg">
          Add Node
        </button>
        <button onClick={onSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg">
          Save
        </button>
        <button onClick={onRestore} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-lg">
          Restore
        </button>
      </div>
      <ReactFlow
        nodes={nodes.map(node => ({
            ...node,
            // We need to pass the onChange handler to each node
            data: {
                ...node.data,
                onChange: (value: string) => onNodeLabelChange(node.id, value),
            },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-100"
      >
        <Controls />
        <MiniMap />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default MindMapPage;
