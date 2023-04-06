import React from 'react';

const TextInput = (props) => {
  return (
    <div className="form-control pb-2">
      <label className="label">
        <span className="label-text uppercase font-base font-medium text-base">{props.label}</span>
      </label>
      <input 
        type="text" 
        placeholder={props.placeholder} 
        className="input input-bordered"
        onChange={(event) => props.func(event.target.value)}
       />
    </div>
  );
};

export default TextInput;
