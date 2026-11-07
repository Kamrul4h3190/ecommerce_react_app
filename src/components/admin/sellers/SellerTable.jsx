import React from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { sellerTableColumns } from "../../helper/tableColumn";

const SellerTable = ({ sellers, pagination }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentPage = Math.max(
    0,
    Number(searchParams.get("page") || 1) - 1
  );

  const pageSize = pagination?.pageSize || 10;

  const rows = (sellers || []).map((item) => ({
    id: item.userId,
    username: item.username,
    email: item.email,
  }));

  const handlePaginationChange = (model) => {
    if (model.page !== currentPage) {
      const params = new URLSearchParams(location.search);

      params.set("page", String(model.page + 1));

      navigate({
        pathname: location.pathname,
        search: `?${params.toString()}`,
      });
    }
  };

  return (
    <div className="max-w-fit mx-auto">
      <DataGrid
        rows={rows}
        columns={sellerTableColumns}
        pagination
        paginationMode="server"
        rowCount={pagination?.totalElements ?? 0}
        paginationModel={{
          page: currentPage,
          pageSize,
        }}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[pageSize]}
        disableRowSelectionOnClick
        disableColumnResize
      />
    </div>
  );
};

export default SellerTable;
