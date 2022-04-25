import React from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [isSelected, setSelected] = React.useState(false);
  const navigate = useNavigate();

  const selectFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setSelected(true);
  };

  const uploadFile = (e) => {
    e.preventDefault();
    console.log(file);
    let form = new FormData();
    form.append("file", file, file.name);
    form.append("fileName", fileName);
    console.log(form);
    axios
      .post("http://127.0.0.1:5000/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => console.log(err));
    // axios
    //   .post("http://127.0.0.1:5000/upload", file)
    //   .catch((err) => {
    //     if (err) {
    //       console.error(err);
    //     }
    //   })
    //   .then((res) => {
    //     if (res) {
    //       console.log(res);
    //       navigate("/");
    //     }
    //   });
  };
  return (
    <React.Fragment>
      <form className="center" onSubmit={uploadFile}>
        <input type={"file"} name="file" onChange={selectFile} />
        <button
          className="upload"
          type="submit"
          disabled={isSelected === false}
        >
          Upload
        </button>
      </form>
    </React.Fragment>
  );
};

export default Upload;
