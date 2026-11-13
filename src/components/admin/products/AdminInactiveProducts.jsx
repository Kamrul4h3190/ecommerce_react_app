import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../shared/Loader';
import { FaBoxOpen } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { adminInactiveProductTableColumn } from '../../helper/tableColumn';
import { useDashboardInactiveProductFilter} from '../../../hooks/useProductFilter';
import ActivationModal from '../../shared/ActivationModal';
import { activateProduct } from '../../../store/actions';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const AdminInactiveProducts = () => {
  
  const {products, pagination} = useSelector((state) => state.products);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const [currentPage, setCurrentPage] = useState(
      pagination?.pageNumber + 1 || 1
    );

  const dispatch = useDispatch();
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [openActivateModal, setOpenActivateModal] = useState(false);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;
  const queryString = `pageNumber=${Number(searchParams.get("page") || 1) - 1}&isActive=false`;

  useDashboardInactiveProductFilter();

  const tableRecords = products?.map((item) => {
  return {
    id: item.productId,
    productName: item.productName,
    description: item.description,
    discount: item.discount,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    specialPrice: item.specialPrice,
  }
});

const handleActivate = (product) => {
  setSelectedProduct(product);
  setOpenActivateModal(true);
};
const handlePaginationChange = (paginationModel) => {
  const page = paginationModel.page + 1;
  setCurrentPage(page);
  params.set("page", page.toString());
  navigate(`${pathname}?${params}`)
};

const onActivateHandler = () => {
  dispatch(activateProduct(setLoader, selectedProduct?.id, toast, setOpenActivateModal, queryString));
};


  const emptyProduct = !products || products?.length ===0;
  return (
    <div>

    {!emptyProduct && (
      <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
        Inactive Products</h1>
    )}
    {isLoading ? (
      <Loader />
    ) : (
      <>
      {emptyProduct ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaBoxOpen size={50} className='mb-3'/>
          <h2 className='text-2xl font-semibold'>
            No Inactive products found
          </h2>
        </div>
      ) : (
        <div className='max-w-full'>
          <DataGrid
            className='w-full'
            rows={tableRecords}
            columns={adminInactiveProductTableColumn(handleActivate)}
            paginationMode='server'
            rowCount={pagination?.totalElements || 0}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination?.pageSize || 10,
                  page: currentPage - 1,
                },
              },
            }}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            disableColumnResize
            pageSizeOptions={[pagination?.pageSize || 10]}
            pagination
            paginationOptions={{
              showFirstButton: true,
              showLastButton: true,
              hideNextButton: currentPage === pagination?.totalPages,
            }}
            />

            <ActivationModal
                  open={openActivateModal}
                  setOpen={setOpenActivateModal}
                  loader={loader}
                  title="Activate Product"
                  onActivateHandler={onActivateHandler}
            />
        </div>
      )}
      </>
    )}
    
    </div>
  )
}

export default AdminInactiveProducts