import React, { useCallback,useContext } from "react";
import userContext from "../context/UserContext";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

const Tree = (props) => {
    const context = useContext(userContext);
    const { setGlass } = context;
  const flowStyle = {
    background: '#ebd7b2',
    color: 'green'
  }

  const handleCancel = ()=>{
    setGlass(false);
    props.glass(false);
  }

  console.log(props.data.initialNodes)
  console.log(props.data.initialEdges)
  const [nodes, setNodes, onNodesChange] = useNodesState(props.data.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.data.initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="treeCss">
    <ReactFlow
      style={flowStyle}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
    <button className="treeCss_btn" onClick={handleCancel}>BACK</button>
    </div>
  );
};

export default Tree;