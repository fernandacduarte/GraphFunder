import React from 'react';

const DescriptionInput = (props) => {
  return (
    <div className="form-control pb-2">
      <label className="label">
        <span className="label-text uppercase font-base font-medium text-base">Description</span>
      </label>
      <textarea className="textarea textarea-bordered leading-normal" placeholder="Provide a short summary of your project here" onChange={(event) => props.func(event.target.value) } ></textarea>
    </div>
  );
};

export default DescriptionInput;
