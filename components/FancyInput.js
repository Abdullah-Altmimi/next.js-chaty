
export default function FancyInput({handleChange, name, placeHolder = name, value, password}) {
  
  return (
    <label className="fancy-input">
      <input name={name} onChange={handleChange} value={value} type={password ? "password" : "text"} />
      <span className={value.length > 0 ? "active" : ""}>{placeHolder}</span>
    </label>
  )
}
