import React, { useState } from "react";
import firebase from "../util/firebase";
import UploadImage from "./UploadImage";
import { v4 as uuid } from "uuid";
import styles from "./Form.module.css";
const db = firebase.firestore();
var storageRef = firebase.storage().ref();
export default function Form() {
  let a = [];
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState({});
  const [orderUploaded, setOrderUploaded] = useState(false);
  //const [imageUrl, setImageUrl] = useState("");
  const [visibility, setVisibility] = useState([]);
  const [addons, setAddons] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [addonError, setAddonError] = useState("");

  const uploadForm = async (e) => {
    console.log("DownloadURL");
    try {
      e.preventDefault();
      const id = uuid();
      var mountainsRef = storageRef.child(id);
      await mountainsRef.put(file);
      //setVisibility(a);
      console.log(visibility);
      let DownloadURL = await storageRef.child(id).getDownloadURL();

      console.log(DownloadURL);
      console.log(title);
      console.log(file);
      let orders = await db.collection("orders").add({
        title: title,
        imageUrl: DownloadURL,
        addons: addons,
        visibility: visibility,
        type: type,
        keywords: keywords,
      });
      let keywordDoc = await db
        .collection("keywords")
        .doc("1sKJt3XpeYiOyQgFcFaj")
        .get();
      let allKeywords = keywordDoc.data().keywords;
      allKeywords = [...allKeywords, ...keywords];
      await db
        .collection("keywords")
        .doc("1sKJt3XpeYiOyQgFcFaj")
        .update({
          keywords: allKeywords,
        });
      console.log("Doc Id: ", orders.id);
      setOrderUploaded(true);
      setTitle("");
      setFile({});
      setKeywords([]);
      console.log("order added to ORDER collection");
    } catch (error) {
      console.log(error);
    }

    //console.log(DownloadURL);
    // let snap = db.collection("orders").add({

    //  })
  };

  // const createTodo = () => {
  //   const todoRef = firebase.database().ref("Todo");
  //   const todo = {
  //     title,
  //     complete: false,
  //     imageUrl,
  //   };

  //   todoRef.push(todo);
  // };
  const checkboxHandler = (e) => {
    if (e.target.checked) {
      //console.log(a)
      setVisibility([...visibility, e.target.value]);
      a.push(e.target.value);
    } else {
      console.log(visibility);
      let d = [...visibility];
      let index = d.indexOf(e.target.value);
      d.splice(index, 1);
      setVisibility([...d]);
      //a.pop(e.target.value);
    }
    console.log(visibility);
  };
  const radioHandler = (e) => {
    setType(e.target.value);
  };
  const removeAddon = (e) => {
    console.log(e.target.id);
    let p = addons;
    let index = p.indexOf(e.target.id);
    p.splice(index, 1);
    setAddonError("");
    setAddons([...p]);
  };
  let options = addons.map((addon) => (
    <li className={styles.addons} className={styles.tagsselli}>
      {addon}
      <span id={addon} className={styles.cross} onClick={removeAddon}>
        x
      </span>
    </li>
  ));
  let addonHandler = (e) => {
    console.log(e.target.value);
    let p = addons;
    if (addons.includes(e.target.value)) {
      console.log("addonError");
      setAddonError("**This option is already Added!");
      return;
    }
    setAddonError("");
    setAddons([...p, e.target.value]);
    var dropDown = document.getElementById("dropdown");
    dropDown.selectedIndex = 0;
  };

  let keywordsHandler = () => {
    let input = document.getElementById("keywordsInput");
    let newKeywords = [...keywords, input.value];
    setKeywords(newKeywords);
    input.value = "";
    console.log(newKeywords);
  };
  return (
    <div>
      <form onSubmit={uploadForm} className={styles.form}>
        <h1 className={styles.h1}>Upload a order</h1>
        <div className={styles.one}>
          <h1 className={styles.h2}>Order number</h1>
          <div className={styles.name}>
            <div className={styles.iiit}>IIITV/21-22/</div>
            <input
              type="text"
              placeholder="Next Order"
              onChange={(e) => setTitle(e.target.value)}
              //value={title}
              className={styles.namei}
            />
          </div>
          <br />
        </div>

        <div className={styles.one}>
          <h1 className={styles.h2}>Upload image</h1>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.drag}
            placeholder="Drop files here"
          />
          <br />
        </div>
        <div className={styles.one}>
          <h3 className={styles.h2}>Internal/External</h3>

          <span>
            <input
              type="radio"
              id="internal"
              name="ie"
              value="internal"
              onChange={radioHandler}
            />
             <label for="internal">Internal</label>
          </span>
          <span>
             {" "}
            <input
              type="radio"
              id="external"
              name="ie"
              value="external"
              onChange={radioHandler}
            />
            <label for="external">External</label>
          </span>
          <br></br>
        </div>
        <div className={styles.one}>
          <h3 className={styles.h2}>Visibility</h3>

          <span>
            <input
              type="checkbox"
              id="registrar"
              name="registrar"
              value="registrar"
              onChange={checkboxHandler}
            />
            <label for="registrar"> Registrar</label>
          </span>
          <span>
            <input
              type="checkbox"
              id="faculty"
              name="faculty"
              value="faculty"
              onChange={checkboxHandler}
            />
            <label for="faculty"> Faculty</label>
          </span>
          <span>
            <input
              type="checkbox"
              id="staff"
              name="staff"
              value="staff"
              onChange={checkboxHandler}
            />
            <label for="staff"> Staff</label>
          </span>
          <span>
            <input
              type="checkbox"
              id="student"
              name="student"
              value="student"
              onChange={checkboxHandler}
            />
            <label for="student"> Student</label>
          </span>
          <br></br>
        </div>
        {/* <input
          type="text"
          placeholder="Addons"
          onChange={handleOnChange}
          value={title}
        /> */}
        <div className={styles.one}>
          <h2 className={styles.h2}>Tags along</h2>
          <select
            name="addons"
            id="dropdown"
            onChange={addonHandler}
            className={styles.hundred}
          >
            <option disabled selected value>
              {" "}
              -- select --{" "}
            </option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
            <option value="Mandatory">Mandatory</option>
            <option value="Hidden">Hidden</option>
            <option value="Student">Student</option>
            <option value="Student2">Student2</option>
            <option value="Student3">Student3</option>
            <option value="Student4">Student4</option>
          </select>
        </div>
        <div className={styles.tagsel}>
          {options}
          <p className={styles.err}>{addonError}</p>
        </div>
        <div className={styles.one}>
          <h2 className={styles.h2}>Add keywords</h2>
          <input
            type="text"
            id="keywordsInput"
            placeholder="Add Keywords"
            className={styles.hundred}
          />{" "}
          <button onClick={keywordsHandler} className={styles.btn}>
            ADD
          </button>
        </div>
        {/* <div className={styles.one}>
          <div className={styles.add}>
            <ul className={styles.flexadd}>
              <li
                className={styles.addons}
                onClick={() => addons.push("Private")}
              >
                Private
              </li>
              <li
                className={styles.addons}
                onClick={() => addons.push("Public")}
              >
                Public
              </li>
              <li
                className={styles.addons}
                onClick={() => addons.push("Mandatory")}
              >
                Mandatory
              </li>
              <li
                className={styles.addons}
                onClick={() => addons.push("Hidden")}
              >
                Hidden
              </li>
              <li
                className={styles.addons}
                onClick={() => addons.push("Student")}
              >
                Student
              </li>
              <li className={styles.addons} onClick={() => addons.push("Abcd")}>
                Abcd
              </li>
            </ul>
          </div>
          <br />
        </div> */}

        <button className={styles.button}>Upload Order </button>
      </form>
      {orderUploaded ? (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Order Uploaded Successfully!
        </p>
      ) : (
        <p></p>
      )}
    </div>
  );
}
