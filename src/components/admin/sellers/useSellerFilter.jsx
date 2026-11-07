import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getAllSellersDashboard } from "../../../store/actions";

const useSellerFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("pageNumber", String(Number(page) - 1));

    dispatch(getAllSellersDashboard(params.toString()));
  }, [dispatch, page]);
};

export default useSellerFilter;
