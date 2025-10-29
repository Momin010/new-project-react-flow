import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// We are using a custom data type for our nodes, so we can type it here
type TextNodeData = {
  label: string;
  onChange: (value: string) => void;
};

const TextNode = ({ data, isConnectable }: NodeProps<TextNodeData>) => {

  const onTextAreaChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (data.onChange) {
          data.onChange(evt.target.value);
      }
  }

  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-md">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!bg-teal-500" />
      <div>
        <textarea
          value={data.label}
          onChange={onTextAreaChange}
          className="w-40 bg-transparent resize-none outline-none nodrag text-center"
          rows={3}
          placeholder="Enter text..."
        />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!bg-teal-500" />
    </div>
  );
};

export default memo(TextNode);
