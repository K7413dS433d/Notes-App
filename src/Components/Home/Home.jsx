import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import {
  getUserNotes,
  addNewNote,
  deleteNote,
  updateNote,
} from "../../Redux/Slices/notesSlice";
import { logout } from "../../Redux/Slices/loginSlice";
import animationData from "./../../assets/animation/notes.json"; // Path to your .lottie file
import noNote from "./../../assets/noNote.png";
import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";

//motion variant
const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 20,
    opacity: 0,
  },
};

function Home() {
  //open modal
  const [selectedId, setSelectedId] = useState(null);
  //open or close colors
  const [open, setOpen] = useState(false);
  //get element height to calculate the notes height
  const [elementHeight, setElementHeight] = useState(0);
  // State for current title and content
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  //search state
  const [search, setSearch] = useState("");

  //using ref to ignore unnecessary re-renders
  //element ref to get the height of the element
  const ref = useRef(null);
  // old title and content (before editing)
  const oldTitleRef = useRef("");
  const oldContentRef = useRef("");
  //new note color
  const colorRef = useRef("");
  //using textareaRef to focus on the textarea when click on content area because textarea is variable height
  const textareaRef = useRef(null);

  //get store to get all states with realtime update without using useSelector because With it states update after re-render
  const store = useStore();
  const dispatch = useDispatch();
  const navigator = useNavigate();

  //get notes from the store
  const { loading, notes } = useSelector((store) => store.notesReducer);
  //get token from the store
  const { token } = useSelector((store) => store.loginReducer);

  //extract date from ISO 8601 date format.
  function extractDate(isoDate) {
    const dateObj = new Date(isoDate);

    // Extract the date in "YYYY-MM-DD" format
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // getMonth is zero-based
    const day = String(dateObj.getDate()).padStart(2, "0");

    // Combine the parts into a date string
    return `${year}-${month}-${day}`;
  }

  //extract color from title to use it as a background color for the note
  function extractColor(text) {
    const color = text.split("#")[0];
    return color;
  }

  //extract title from title to use it as a note title
  function extractContent(text) {
    const contentText = text.split("#").slice(1).join("#");
    return contentText;
  }

  //open or close colors when press on + icon
  function toggleColorPicker(e) {
    if (
      e.target == e.currentTarget.firstChild ||
      e.target.parentNode == e.currentTarget.firstChild
    ) {
      setOpen(!open);
    }
  }

  //handle note changes when open existing note or add new note
  function handleNoteChanges(noteTitle, noteContent, noteId) {
    setSelectedId(noteId);
    setTitle(noteTitle);
    setContent(noteContent);
    oldTitleRef.current = noteTitle;
    oldContentRef.current = noteContent;
    if (noteId != "new") {
      //get the color from the content
      colorRef.current = extractColor(noteContent);
    }
  }

  // after click on the color open modal and get colo to add new note
  function newNote(e) {
    colorRef.current = e.target.dataset.color;
    handleNoteChanges("", "", "new");
  }

  //close note modal trigger add or update note
  //check if out of modal or x icon
  function closeNote(e) {
    //stop propagation to avoid closing the modal twice
    e.stopPropagation();
    if (e.target.dataset.close) {
      if (content != oldContentRef.current || title != oldTitleRef.current) {
        if (!oldContentRef.current || !oldTitleRef.current) {
          //new note
          dispatch(
            addNewNote({
              note: { title, content: colorRef.current + "#" + content },
              token,
            })
          ).then(() => {
            if (store.getState().notesReducer.error)
              toast.error(store.getState().notesReducer.error, {
                toastId: "newNoteError",
                autoClose: 3000,
              });
          });
        } else {
          //update note
          dispatch(
            updateNote({
              id: selectedId,
              note: {
                title,
                //check content updated to add color or not
                content:
                  content == oldContentRef.current
                    ? content
                    : colorRef.current + "#" + content,
              },
              token,
            })
          ).then(() => {
            if (store.getState().notesReducer.error)
              toast.error(store.getState().notesReducer.error, {
                toastId: "updateError",
                autoClose: 3000,
              });
          });
        }
        setSelectedId(null);
      } else {
        //close without update
        setSelectedId(null);
      }
    }
  }

  //delete note
  function handleDeleteNote(e, id, token) {
    e.stopPropagation();
    dispatch(deleteNote({ id, token })).then(() => {
      if (store.getState().notesReducer.error)
        toast.error(store.getState().notesReducer.error, {
          toastId: "EmailError",
          autoClose: 3000,
        });
    });
  }

  //get element height
  useEffect(() => {
    //calculate the top element height
    setElementHeight(ref.current.offsetHeight);
    //get all notes
    dispatch(getUserNotes(token));
  }, [ref]);

  return (
    <main className="p-5 md:p-0 bg-[#eee] h-screen overflow-hidden flex flex-col md:flex-row ">
      <aside className="hidden md:flex flex-col items-center gap-6  border-r-2 border-gray-300 md:p-5  bg-primary ">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-lg  font-bold ">
          Docket
        </h1>
        {/* new note  */}
        <div
          // check for clicking on the icon only
          onClick={toggleColorPicker}
          className={`${
            open ? style.active : style.close
          } fixed md:static bottom-7 right-7 rotate-180 md:rotate-0 z-30 w-fit h-fit bg-white md:max-xl:w-9 flex items-center justify-center rounded-full`}
        >
          {/* colors  */}
          <div
            className={`${style.rotate} bg-black w-10 h-10 md:max-xl:h-9 md:max-xl:w-9 z-30 rounded-full justify-center items-center flex cursor-pointer`}
          >
            <i className="fa-solid fa-plus text-white fa-lg"></i>
          </div>
          <ul
            className={` absolute h-5 w-5 rounded-full cursor-pointer z-20`}
            onClick={newNote}
          >
            <li
              data-color="LightGold"
              className={`${style.colors} absolute h-5 w-5 rounded-full cursor-pointer z-20 bg-LightGold`}
            ></li>
            <li
              data-color="PastelOrange"
              className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-PastelOrange`}
            ></li>
            <li
              data-color="LightLavender"
              className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-LightLavender`}
            ></li>
            <li
              data-color="BrightCyan"
              className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-BrightCyan`}
            ></li>
            <li
              data-color="PaleYellow"
              className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-PaleYellow`}
            ></li>
          </ul>
        </div>
        <div
          onClick={() => {
            dispatch(logout());
            navigator("/login");
          }}
          className="bg-Charcoal w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 hidden md:flex rounded-full  justify-center items-center absolute bottom-8 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-white sm:fa-xl"></i>
        </div>
        {/* end */}
      </aside>

      <section className="flex flex-col md:py-5 w-full relative">
        {loading && (
          <div className="h-full absolute w- top-0 left-0 right-0 bottom-0 flex justify-center items-center z-40 bg-[#f5f5f5]">
            <Lottie animationData={animationData} className="w-80" />
          </div>
        )}

        {/* navbar */}
        <nav className="flex justify-between items-center" ref={ref}>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-lg  font-bold md:hidden z-40">
            Docket
          </h1>
          {/* search  */}
          <div className="h-9 sm:h-10 flex items-center gap-1 rounded-3xl bg-white w-1/2  md:m-auto ">
            <label htmlFor="search">
              <i className="fa-solid fa-magnifying-glass opacity-65 cursor-pointer ms-1"></i>
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search"
              className="focus:outline-none w-full h-full rounded-3xl px-1"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            onClick={() => {
              dispatch(logout());
              navigator("/login");
            }}
            className="bg-Charcoal w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:hidden rounded-full flex justify-center items-center cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-white sm:fa-xl"></i>
          </div>
        </nav>

        {/* notes  */}
        <div
          className="p-2 xs:p-4 sm:p-5"
          style={{ height: `calc(100vh - (${elementHeight}px + 20px))` }}
        >
          {/* add note  */}
          <div
            // check for clicking on the icon only
            onClick={toggleColorPicker}
            className={`${
              open ? style.active : style.close
            } fixed md:hidden  right-5 rotate-90  z-30 w-fit h-fit bg-white md:max-xl:w-9  flex items-center justify-center rounded-full cursor-pointer`}
          >
            {/* colors  */}
            <div
              className={`${style.rotate} bg-black w-10 h-10 md:max-xl:h-9 md:max-xl:w-9 z-30 rounded-full justify-center items-center flex cursor-pointer`}
            >
              <i className="fa-solid fa-plus text-white fa-lg"></i>
            </div>
            <ul
              onClick={newNote}
              className="absolute h-5 w-5 rounded-full cursor-pointer z-20"
            >
              <li
                data-color="LightGold"
                className={`${style.colors} absolute h-5 w-5 rounded-full cursor-pointer z-20 bg-LightGold`}
              ></li>
              <li
                data-color="PastelOrange"
                className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-PastelOrange`}
              ></li>
              <li
                data-color="LightLavender"
                className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-LightLavender`}
              ></li>
              <li
                data-color="BrightCyan"
                className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-BrightCyan`}
              ></li>
              <li
                data-color="PaleYellow"
                className={`${style.colors} absolute w-5 h-5 rounded-full cursor-pointer z-20 bg-PaleYellow`}
              ></li>
            </ul>
          </div>
          {/* end */}

          <h2
            className="text-lg xs:text-2xl sm:text-3xl font-semibold mb-5"
            ref={ref}
          >
            Notes
          </h2>

          {notes.length == 0 ? (
            <div className="w-full h-full flex justify-center items-center">
              <img
                src={noNote}
                alt="no notes"
                className="block w-80 sm:w-96 "
              />
            </div>
          ) : (
            <motion.div
              className={`grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 h-[90%] overflow-y-auto ${style.noScrollBar} `}
            >
              <AnimatePresence mode="popLayout">
                {notes
                  ?.filter((item) =>
                    search ? item.title.includes(search) : true
                  )
                  .map((item) => (
                    <motion.div
                      className={`bg-${extractColor(
                        item.content
                      )} rounded-xl p-3 cursor-pointer h-24 xs:h-28 sm:h-36 md:h-44 relative select-none ${
                        selectedId == item._id ? "invisible" : ""
                      }`}
                      key={item._id}
                      layoutId={item._id}
                      variants={itemAnimation}
                      initial="hidden" // Initial state on entry
                      animate="visible" // Animate to visible state
                      exit="exit" // Exit animation when removed
                      onClick={() =>
                        handleNoteChanges(item.title, item.content, item._id)
                      }
                    >
                      <motion.h5
                        className={`border-b-2 font-semibold text-xs xs:text-base sm:text-lg border-[#dcdcdca2] ${style.truncateLine}`}
                      >
                        {item.title}
                      </motion.h5>
                      <motion.h2
                        className={`${style.truncate} text-xs sm:text-base `}
                      >
                        {extractContent(item.content)}
                      </motion.h2>
                      <motion.h6 className="absolute bottom-1 left-0 right-0 px-3  flex justify-between items-center">
                        <p className=" opacity-60 text-xs xs:text-sm sm:text-base md:text-lg">
                          {extractDate(item.createdAt)}
                        </p>
                        {/* {item._id} */}
                        <i
                          className="fa-solid fa-trash text-xs xs:text-sm sm:text-base md:text-lg"
                          onClick={(e) => handleDeleteNote(e, item._id, token)}
                        ></i>
                      </motion.h6>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          )}
          {/* modal  */}
          <AnimatePresence>
            {selectedId && (
              <motion.div
                className="fixed top-0 left-0 bottom-0 right-0 cursor-pointer flex  justify-center items-center bg-black bg-opacity-50 z-50 "
                onClick={closeNote}
                data-close={true}
              >
                <motion.div
                  layoutId={selectedId}
                  className="bg-white min-h-[50%] rounded-xl p-3 absolute  left-10 right-10  cursor-text max-h-[80vh] overflow-y-auto flex flex-col "
                >
                  {/* header  */}
                  <div className="flex justify-between border-b-2 gap-4 pb-3 w-full ">
                    <input
                      className="focus:outline-none w-full"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                    <motion.button
                      className="bg-black w-6 h-6 rounded-full text-white flex justify-center items-center  "
                      data-close={true}
                      onClick={closeNote}
                    >
                      <i className="fa-solid fa-xmark" data-close={true}></i>
                    </motion.button>
                  </div>
                  {/* body  */}
                  <div
                    className="flex-1"
                    onClick={() => {
                      textareaRef.current.focus();
                      textareaRef.current.setSelectionRange(-1, -1);
                    }}
                  >
                    <textarea
                      ref={textareaRef}
                      className="focus:outline-none py-3  w-full resize-none "
                      defaultValue={extractContent(content)} // default value to show the content
                      rows={Math.min(content.split("\n").length, 10)}
                      placeholder="Content"
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

export default Home;
