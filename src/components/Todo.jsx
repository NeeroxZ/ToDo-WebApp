import {Checkbox, Grid, Typography} from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {Bookmark, BookmarkBorder} from "@mui/icons-material";
import {memo, useEffect, useState} from "react";
import {checkIfDue, zeroPad} from "../utils/functions";
import pb from "../utils/pocketbase";
import '../styles/todo.css'
import Grow from '@mui/material/Grow';
import {useAuth} from "../stores/AuthStore";

const Todo = (props) => {
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState("");
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [topic, setTopic] = useState("");
    const [due, setDue] = useState(false);
    const [date, setDate] = useState(new Date());
    const [repetitive, setRepetitive] = useState("");

    const [test, setTest] = useState(false);

    const {getUserId} = useAuth();



    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTitle(props.data.title);
        setDone(props.data.done);
        setSaved(props.data.saved);
        console.log(props.data.saved);
        setComment(props.data.comment);
        setTopic(props.data.topic)

        // check if element is due
        let resDate = new Date(props.data.due_date);
        resDate.setHours(resDate.getHours() - 1);
        setDate(resDate);
        if (checkIfDue(resDate)) {
            setDue(true);
        } else {
            setDue(false);
        }
    }, [props.data])

    const handleChange = (event) => {
        event.stopPropagation();
        setDone(event.target.checked);

        let data = {
            done: event.target.checked,
        }
        updateTodo(data)
            .catch((error) => {
                alert("could not sync with database: " + error.toString())
            })
    };

    const updateTodo = async (data) => {
        await pb.collection('todo').update(props.id, data);
        // props.reloadTodos()
    };

    const handleSaved = async (event) => {
        event.stopPropagation();
        setSaved(event.target.checked);
        let data = {
            saved: event.target.checked,
        }
        updateTodo(data)
            .catch((error) => {
                alert("could not sync with database: " + error.toString())
            })
    };

    const handleOpenModal = (e) => {
        if (!props.disableEdit) {
            props.setEditDate({
                id: props.id,
                title: title,
                done: done,
                comment: comment,
                date: date,
                topic: topic,
                saved: saved,
            });
            props.setShowEdit(true);
        }
    };

    // if (props.reloading) {
    //     return null;
    // }

    return (
        <>
            <div className={`todo-container ${done
                ? "done"
                : (saved ? "saved" : "")} ${due ? "due" : ""}`}
                 onClick={(e) => handleOpenModal(e)}
            >
                {!props.reloading &&

                    <Grid container direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={0}
                    >
                        <Grid item xs={10} md={10} className={"todo-front"}>
                            <Checkbox
                                icon={<RadioButtonUncheckedIcon color={"textWhite"}/>}
                                // checked={props.data.done}
                                checked={done}
                                checkedIcon={<RadioButtonCheckedIcon color={"textWhite"}/>}
                                color={"textWhite"}
                                className={"todo-done"}
                                onClick={handleChange}
                            />
                            <Typography variant="h5" color={"textWhite"} className={`todo-title ${done ? "done" : ""}`}>
                                {/*{props.data.title}*/}
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1}>
                            <div className={"todo-icon"}>
                                <Checkbox
                                    icon={<BookmarkBorder color="textWhite"/>}
                                    // checked={props.data.saved}
                                    checked={saved}
                                    checkedIcon={<Bookmark color="textWhite"/>}
                                    className={"todo-done"}
                                    onClick={handleSaved}
                                />
                            </div>
                        </Grid>
                    </Grid>
                }
            </div>
        </>
    );
};

export default memo(Todo);