import React from "react";

export default function Fromfeild({ title, value, onChange }) {
  const handleChange = (e) => {
    // Ensure that the onChange function is called with the correct parameters
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <label className="my-2" htmlFor={title}>
      <span className="flex flex-col">{title}</span>
      <input
        className="border rounded-md border-black my-1 px-2 w-full"
        placeholder={title}
        name={title}
        value={value}
        onChange={handleChange} // Use handleChange function instead
        type={title === "Password" ? "password" : "text"}
      />
    </label>
  );
}
