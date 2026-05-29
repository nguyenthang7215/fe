import { useState } from "react";

export default function FormData() {
  const [inputValue, setInputValue] = useState("");

  function handleInputChange(e) {
    const value = e.target.value;
    setInputValue(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Your name is ${inputValue}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Your name</label>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
