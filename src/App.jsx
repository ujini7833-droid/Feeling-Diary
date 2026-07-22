import "./App.css";
import Home from "./assets/pages/Home";
import Diary from "./assets/pages/Diary";
import New from "./assets/pages/New";
import NotFound from "./assets/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import { useReducer, useRef, useEffect } from "react";
import Edit from "./assets/pages/Edit";
import {
  DiaryDispatchContext,
  DiaryStateContext,
} from "./context/DiaryContext";

// 1. "/" :  모든 일기를 조회하는 홈페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세하게 조회하는 Diary 페이지

function reducer(state, action) {
  let nextState;
  
  switch(action.type) {
    case 'CREATE' :
    {
      nextState = [action.data, ...state]; 
      break;
    }

    case 'UPDATE' : 
    { nextState = state.map((item) => 
      String(item.id) === String(action.data.id)
     ? action.data : item
  );
  break;
}

  case 'DELETE' : 
  { nextState =  state.filter(
    (item) => String(item.id) !== String(action.id)
  );
  break;
}

  default:
    return state;
  }

  return nextState;
}

const getInitialData = () => {
  try {
    const storedData = localStorage.getItem("diary");
    if(!storedData) {
      return [];
    }

    const parsedData = JSON.parse(storedData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch {
    return [];
  }
};

function App() {
  const [data, dispatch] = useReducer(reducer, undefined, getInitialData);
  const idRef = useRef(
    data.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1
  );

  useEffect(() => {
    localStorage.setItem("diary", JSON.stringify(data));
  }, [data]);

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: 'CREATE',
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content
      },
    });
  };

  // 기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch(
      {
        type: "UPDATE",
        data: {
        id, 
        createdDate,
        emotionId,
        content
      },
      }
    )
  }

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: 'DELETE',
      id
    })
  }

  return (
    <>

  <DiaryStateContext.Provider value={data}>
    <DiaryDispatchContext.Provider value={{
      onCreate, onDelete, onUpdate
    }}
    >
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/new" element={<New />} />
    <Route path="/diary/:id" element={<Diary />} />
    <Route path="/edit/:id" element={<Edit />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  </DiaryDispatchContext.Provider>
  </DiaryStateContext.Provider>
    </>
  )
}

export default App;
