const Input = ({colorValue,SetColorValue}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
        <label> add color name</label>
        <input
        autoFocus
        type='text'
        placeholder="add color name"
        required
        value={colorValue}
        onChange={(e) => SetColorValue(e.target.value)}
        />
        </form>
  )
}

export default Input