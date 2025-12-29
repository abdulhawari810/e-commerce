import React from "react";

const TextInput = React.memo(
  ({ name, label, value, type = "text", onChange }) => {
    return (
      <div className="flex items-center w-[270px] h-12 relative rounded-lg">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          id={name}
          placeholder=" "
          autoComplete="off"
          className="w-full peer h-full px-5 text-slate-900 font-medium
          outline outline-slate-500 rounded-lg
          focus:outline-slate-950 not-placeholder-shown:outline-slate-950"
        />
        <label
          className="absolute left-5 text-slate-500
          peer-focus:text-xs peer-focus:-translate-y-6 peer-focus:bg-slate-50
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:-translate-y-6
          peer-not-placeholder-shown:bg-slate-50 px-2"
          htmlFor={name}
        >
          {label}
        </label>
      </div>
    );
  }
);
export default TextInput;
