import {Todo} from "../../components/Todo";
import {useEffect, useState} from "react";
import {useAuth} from "../../stores/AuthStore";
import pb from "../../utils/pocketbase";
import PropTypes from 'prop-types';
import {NoContent} from "../NoContent";
import {AddTodo} from "../../components/AddTodo";
import {getParams} from "../../utils/getParams";
import {CircularProgress} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "../../styles/todo.css"



export const TodoPage = (props) => {
    const auth = useAuth();
    const [heading, setHeading] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todosLoaded, setTodosLoaded] = useState(0);
    const [allLoaded, setAllLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [noTodo, setNoTodo] = useState(null);

    const {getUserId} = useAuth();


    const getTodos = async () => {
        if (auth.loginValid) {
            setLoading(true);
            setTodosLoaded(0);
            setAllLoaded(false);
            setNoTodo(false);
            setError(false);
            setData([]);
            let res = {};
            try {
                let params = getParams(props, getUserId());
                /* Todo (Marvin):   könnte zu Fehlern und performance Problemen führen,
                                    wenn mehr als 1000 todos gespeichert wurden */
                res = await pb.collection('todo').getList(1, 1000, {
                    filter: params,
                    sort: '-due_date'
                });
                setError(null);
                setData(res.items);
                if (res.items.length <= 0) {
                    setNoTodo(true);
                }
            } catch (err) {
                setError(err.message);
                console.log(err.message)
                setData(null);
            } finally {
                setLoading(false);
            }
        }
    };


    useEffect( () => {
        getTodos();
        setHeading(props.pageHeading);
    }, [props.topic, auth.loginValid]);

    // check if all todos fetched data
    const addLoaded = () => {
        setTodosLoaded(count=> count+1)
    };
    useEffect(() => {
        if (!loading) {
            if (todosLoaded === data.length) {
                setAllLoaded(true);
            }
        }
    }, [todosLoaded, noTodo]);


    // conditional rendering
    if (loading) {
        return (
            <>
                <div className={"screen_container"}>
                    <CircularProgress className={"progress_bar"}/>
                </div>
            </>
        );
    }
    if (noTodo) {
        return (
            <>
                <NoContent variant="todo"/>
                {props.showFab &&
                    <div>
                        <div className={"fixedRightContainer"}>
                            <div className="arrow">
                                <ArrowDownwardIcon
                                    fontSize="large"
                                    color="primary"
                                />
                            </div>
                        </div>
                        <AddTodo
                            reloadOnAdd={true}
                            reloadFunction={getTodos}
                            loading={!allLoaded}
                            selectedTopic={props.topic}
                        />
                    </div>
                }
            </>
        );
    }
    return (
        <>
            {data &&
            props.scrollable
                ?
                <div className="scrollContainer">
                    {props.showInfo &&
                        <div className={"tdPgHeadingContainer"}>
                            <div className={"tdPgHeading"}>{heading}</div>
                        </div>
                    }
                    <ul className="todo-list">
                        {data && data.map((item, i) =>
                            <li key={i}>
                                <Todo id={item.id} doneLoading={addLoaded}/>
                            </li>)}
                    </ul>
                </div>
                :
                <>
                    {props.showInfo &&
                        <div className={"tdPgHeadingContainer"}>
                            <div className={"tdPgHeading"}>This is the heading</div>
                        </div>
                    }
                    <ul className="todo-list">
                        {data && data.map((item, i) =>
                            <li key={i}>
                                <Todo id={item.id} doneLoading={addLoaded}/>
                            </li>)}
                    </ul>
                </>
            }
            {props.showFab &&
                <AddTodo
                    reloadOnAdd={true}
                    reloadFunction={getTodos}
                    loading={!allLoaded}
                    selectedTopic={props.topic}
                />
            }
        </>
    );
};

TodoPage.defaultProps = {
    showInfo: false,
    selectedTopic: null,
    topic: null,
    pageHeading: "",
    loading: false,
};

TodoPage.propType = {
    scrollable: PropTypes.bool.isRequired,
    showFab: PropTypes.bool.isRequired,
    showInfo: PropTypes.bool,
    pageHeading: PropTypes.string,
    bookmarkFilter: PropTypes.bool,
    deletedFilter: PropTypes.bool,
    topic: PropTypes.object,
    tagFilter: PropTypes.bool,
    dateFrom: PropTypes.string,
    dateUntil: PropTypes.string,
}



