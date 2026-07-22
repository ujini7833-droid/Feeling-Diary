import { useContext, useState, useEffect } from "react";
import { DiaryStateContext } from "../context/DiaryContext";
import { useNavigate } from "react-router-dom";

const useDiary = (id) => {
    const data = useContext(DiaryStateContext);
     const curDiaryItem = data.find(
        (item) => String(item.id) === String(id)
    );
    const nav = useNavigate();

    useEffect(() => {
        if (!curDiaryItem) {
            window.alert("존재하지 않는 일기입니다.");
            nav("/", { replace: true });
        }
        }, [curDiaryItem, nav]);

        return curDiaryItem;
};

export default useDiary;
