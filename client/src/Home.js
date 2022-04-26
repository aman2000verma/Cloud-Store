import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Buffer } from "buffer";

const Home = () => {
  const navigate = useNavigate();
  const [list, setList] = React.useState([]);
  React.useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    await axios
      .get("http://localhost:5000/")
      .catch((err) => {
        if (err) {
          console.error(err);
        }
      })
      .then((res) => {
        if (res) {
          console.log(res);
          setList(res.data);
        }
      });
  };

  const deleteFile = async (name) => {
    await axios
      .delete(`http://localhost:5000/delete/${name}`)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      .then((res) => {
        if (res) {
          console.log(res);
          getList();
        }
      });
  };

  const downloadFile = async (name) => {
    await axios
      .get(`http://localhost:5000/get/${name}`)
      .catch((err) => {
        if (err) {
          console.error(err);
        }
      })
      .then((res) => {
        if (res) {
          const buffer = Buffer.from(res.data.Body.data);
          const blob = new Blob([buffer], { type: res.data.ContentType });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      });
  };

  return (
    <React.Fragment>
      <button className="upload" onClick={() => navigate("/upload")}>
        Upload New File
      </button>
      <table className="center">
        <tr>
          <th>Name</th>
          <th>Last Modified</th>
          <th>Size</th>
          <th>Actions</th>
        </tr>
        {list.map((item) => {
          return (
            <tr>
              <td>{item.Key}</td>
              <td>
                {moment(item.LastModified).format("MMMM Do YYYY, h:mm:ss a")}
              </td>
              <td>{Math.round(item.Size / 1024)} KB</td>
              <td>
                <button
                  className="download"
                  onClick={() => downloadFile(item.Key)}
                >
                  Download
                </button>
                <button className="delete" onClick={() => deleteFile(item.Key)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </table>
    </React.Fragment>
  );
};

export default Home;
