export function App() {
  return (
    <div>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();

          const { currentTarget: form } = e;

          fetch('http://localhost:7071/api/upload-image', {
            method: 'POST',
            body: new FormData(form),
          });
        }}
      >
        <label htmlFor="image">Bird Image</label>
        <input type="file" name="image" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;
