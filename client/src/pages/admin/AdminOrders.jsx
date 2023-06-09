import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { IoWarning } from "react-icons/io5";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { BiPrinter } from "react-icons/bi";
import Search from "../../components/forms/AdminSearchForm";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { TiPrinter } from "react-icons/ti";
import logo from "../../assets/logo1.png";
import { TbCopyright } from "react-icons/tb";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";

export default function AdminOrders() {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Ready for Pickup",
    "Refunded",
  ]);
  const [orders, setOrders] = useState([]);
  const [changedStatus, setChangedStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();

  const { Option } = Select;

  // handleOrderDetailsClick
  const handleOrderDetailsClick = (orders) => {
    setDialogOpen(true);
    setSelectedOrder(orders);
    setSelectedOrderProducts(orders.products);
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/all-orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const componentRef = useRef(null);

  const handleChange = async (orderId, value) => {
    setChangedStatus(value);
    try {
      const { data } = await axios.put(`/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/deleteorders/${selectedOrderId}`);
      if (response.status === 200) {
        // Show a success message with the user's first name
        toast.success("Order deleted succesfully ");
        setIsDialogOpen(false);
        setOrders(orders.filter((o) => o._id !== selectedOrderId));
        setSelectedOrderId(null);
      } else {
        console.log("Error deleting user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(selectedOrder);

  const customBuilds = [
    "Specialized Frame Custom Build",
    "Wilier Filante Custom Build",
    "Exploro Frame Custom Build",
  ];

  return (
    <>
      <div className={`px-10 py-5 font-bebas bg-gray-200 `}>
        <div className="flex justify-between mb-3">
          <ReactToPrint
            trigger={() => {
              return (
                <button className="flex items-center gap-1 hover:text-orange-500">
                  <BiPrinter fontSize={25} />
                  print order
                </button>
              );
            }}
            content={() => componentRef.current}
            documentTitle="Print Order History"
            pageStyle="print"
          />
        </div>

        <div>
          <Paper>
            <div className="py-2 px-4 border-b bg-white flex justify-between">
              <strong className="text-3xl tracking-wider flex items-center gap-1">
                ORDER HISTORY{" "}
                <MdOutlineHistoryEdu className="text-yellow-500" />
              </strong>

              <Search />
            </div>

            <div className="p-4 bg-white">
              <table
                className="w-[100%] justify-evenly border"
                ref={componentRef}
              >
                <thead className="border-b">
                  <tr className="text-left text-xl tracking-wide bg-gray-100">
                    <th className="p-2">Order Id</th>
                    <th className="p-2">User</th>
                    <th className="p-2">product</th>
                    <th className="p-2">price</th>
                    <th className="p-2">email</th>
                    <th className="p-2">order date</th>
                    <th className="p-2">Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.map((o, i) => (
                    <>
                      {o?.products?.map((p, i) => (
                        <>
                          <tr key={i} className="border-b">
                            <td className="p-2 font-oswald text-sm">
                              {o?.ordernumber}
                            </td>

                            <td className="p-2 font-oswald text-sm">
                              {o?.buyer?.lastname},{o?.buyer?.firstname}
                            </td>

                            <td className="p-2 font-oswald text-sm">
                              {p.name}
                            </td>

                            <td className="p-2">
                              {p.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "PHP",
                              })}
                            </td>

                            <td className="p-2 font-oswald text-sm">
                              {o?.buyer?.email}
                            </td>

                            <td className="p-2 font-oswald text-sm">
                              {moment(o?.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss"
                              )}
                            </td>

                            <td className="p-2">
                              <Select
                                bordered={false}
                                onChange={(value) => handleChange(o._id, value)}
                                variant="standard"
                                defaultValue={o.status}
                              >
                                {status.map((s, i) => (
                                  <Option value={s} key={i}>
                                    {s}
                                  </Option>
                                ))}
                              </Select>
                            </td>

                            <td className="p-2">
                              <button
                                className="p-1 hover:bg-gray-100"
                                onClick={() => handleOrderDetailsClick(o)}
                              >
                                <BsThreeDotsVertical />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-100"
                                onClick={() => {
                                  setIsDialogOpen(true);
                                  setSelectedOrderId(o._id);
                                }}
                              >
                                <AiOutlineDelete />
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>

              {/* dialog */}
              <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                ref={componentRef}
                maxWidth="xl"
              >
                <DialogTitle sx={{ backgroundColor: "gray" }}>
                  <div className="flex justify-between w-[45rem] text-white">
                    <div className="font-bebas">
                      <img src={logo} alt="" className="w-44" />
                      <h1 className="tracking-wider text-6xl font-bold">
                        Order Details
                      </h1>
                    </div>

                    <div className="space-y-2 font-bebas mt-8">
                      <h1 className="text-xl font-bold tracking-wider">
                        Cyclecore Bikeshop
                      </h1>
                      <h1 className="font-oswald text-xs">
                        390 Col. Bonny Serrano Ave, Project 4
                      </h1>
                      <h1 className="font-oswald text-xs">
                        Quezon City, Metro Manila
                      </h1>
                      <h1 className="font-oswald text-xs">
                        Manila, Philippines
                      </h1>
                      <h1 className="font-oswald text-xs">1192</h1>
                    </div>
                  </div>
                </DialogTitle>

                <DialogContent>
                  {selectedOrder && (
                    <>
                      <div className="font-bebas flex justify-between mt-4">
                        <div>
                          <h1 className="text-sm">
                            bill to:{" "}
                            <span className="text-sm font-oswald font-medium">
                              {selectedOrder.buyer.firstname}{" "}
                              {selectedOrder.buyer.lastname}
                            </span>
                          </h1>
                          <h1 className="text-sm font-oswald font-medium">
                            {selectedOrder.shippingAddress.street}
                          </h1>
                          <h1 className="text-sm font-oswald font-medium">
                            {selectedOrder.shippingAddress.city}
                          </h1>
                          <h1 className="text-sm font-oswald font-medium">
                            {selectedOrder.shippingAddress.region}
                          </h1>
                          <h1 className="text-sm font-oswald font-medium">
                            {selectedOrder.shippingAddress.postalCode}
                          </h1>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm">
                            Delivery Type:{" "}
                            <span className="font-bold font-oswald text-xs">
                              {selectedOrder.deliveryOption}
                            </span>
                          </div>

                          <div className="text-sm">
                            Payment Type:{" "}
                            <span className="font-bold font-oswald text-xs">
                              {selectedOrder.payment?.transaction?.creditCard
                                ?.cardType
                                ? selectedOrder.payment?.transaction?.creditCard
                                    ?.cardType
                                : selectedOrder.paymentOption}
                            </span>
                          </div>
                          <div className="text-sm">
                            Card Type:{" "}
                            <span className="font-bold text-xs font-oswald">
                              {selectedOrder.payment?.transaction
                                ?.paymentInstrumentType
                                ? selectedOrder.payment?.transaction
                                    ?.paymentInstrumentType
                                : " None "}
                            </span>
                          </div>
                          <div className="text-sm">
                            Transaction ID:{" "}
                            <span className="font-bold font-oswald text-xs">
                              {selectedOrder.payment?.transaction.id
                                ? selectedOrder.payment.transaction.id
                                : " None "}
                            </span>
                          </div>
                          <h1 className="text-xs">
                            order id#:{" "}
                            <span className="font-bold font-oswald text-xs">
                              {selectedOrder.ordernumber}
                            </span>
                          </h1>
                          <h1 className="text-xs">
                            Payment Status:{" "}
                            <span className="font-bold font-oswald text-xs">
                              {selectedOrder.payment?.success
                                ? "Success"
                                : "Failed"}
                            </span>
                          </h1>
                          <h1 className="text-xs">
                            Shipping Status:{" "}
                            <span
                              className={`text-xs font-oswald font-bold ${
                                selectedOrder.status === status[0]
                                  ? "text-red-500"
                                  : selectedOrder.status === status[1]
                                  ? "text-yellow-500"
                                  : selectedOrder.status === status[2]
                                  ? "text-blue-500"
                                  : selectedOrder.status === status[3]
                                  ? "text-green-500"
                                  : selectedOrder.status === status[4]
                                  ? "text-gray-500"
                                  : selectedOrder.status === status[5]
                                  ? "text-green-500"
                                  : selectedOrder.status === status[6]
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              {selectedOrder.status}
                            </span>
                          </h1>
                          <h1 className="text-xs">
                            Date:{" "}
                            <span className="font-bold text-xs font-oswald">
                              {moment(selectedOrder.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss"
                              )}
                            </span>
                          </h1>
                        </div>
                      </div>

                      <div className="h-[1px] bg-gray-200 my-3" />

                      <div className="flex justify-between font-bebas">
                        <div>
                          <h1 className="font-bold text-lg tracking-wide">
                            Item
                          </h1>
                        </div>
                        <div className="flex space-x-20 text-lg font-bebas">
                          <h1 className="font-bold">Quantity</h1>
                          <h1 className="font-bold">Price</h1>
                          <h1 className="font-bold">Amount</h1>
                        </div>
                      </div>
                      {selectedOrder.products.map((p, i) => (
                        <>
                          <div
                            key={i}
                            className="font-bebas flex justify-between"
                          >
                            <div className="font-oswald text-xs">
                              {customBuilds.some((build) =>
                                p.name.includes(build)
                              ) ? null : (
                                <>
                                  <div className="mt-2">{p.name}</div>
                                </>
                              )}
                              {console.log(p.name)}
                              {customBuilds.some((build) =>
                                p.name.includes(build)
                              ) && (
                                <>
                                  <div className="mt-2">
                                    {p.customframename}
                                  </div>
                                  <div className="mt-2">
                                    {p.customhandlebarname}
                                  </div>
                                  <div className="mt-2">
                                    {p.customgroupsetname}
                                  </div>
                                  <div className="mt-2">
                                    {p.customwheelsetname}
                                  </div>
                                  <div className="mt-2">{p.customtirename}</div>
                                  <div className="mt-2">
                                    {p.customtsaddlename}
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="font-bebas flex space-x-[4rem]">
                              <div className="text-lg">
                                <div>
                                  <div className="text-sm">
                                    <div className="mt-2">{p.quantity}</div>
                                    {customBuilds.some((build) =>
                                      p.name.includes(build)
                                    ) ? (
                                      <>
                                        {customBuilds.some((build) =>
                                          p.name.includes(build)
                                        ) ? null : (
                                          <div className="mt-2">
                                            {p.quantity}
                                          </div>
                                        )}
                                        <div className="mt-2">{p.quantity}</div>
                                        <div className="mt-2">{p.quantity}</div>
                                        <div className="mt-2">{p.quantity}</div>
                                        <div className="mt-2">{p.quantity}</div>
                                        {p.name.includes(
                                          "Wilier Filante Custom Build"
                                        ) ? null : (
                                          <div className="mt-2">
                                            {p.quantity}
                                          </div>
                                        )}
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="text-lg">
                                <div className="mt-2">
                                  <div className="text-sm">
                                    {customBuilds.some((build) =>
                                      p.name.includes(build)
                                    ) ? null : (
                                      <>
                                        <div>
                                          {p.price.toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP",
                                          })}
                                        </div>
                                      </>
                                    )}
                                    {p.name.includes(
                                      "Specialized Frame Custom Build"
                                    ) ||
                                    p.name.includes(
                                      "Wilier Filante Custom Build"
                                    ) ||
                                    p.name.includes(
                                      "Exploro Frame Custom Build"
                                    ) ? (
                                      <>
                                        <div className="mt-2">
                                          {p.customframeprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customhandlebarprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customgroupsetprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customwheelsetprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customtireprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customsaddleprice}
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="text-lg">
                                <div className="mt-2">
                                  <div className="text-sm">
                                    {customBuilds.some((build) =>
                                      p.name.includes(build)
                                    ) ? null : (
                                      <>
                                        <div>
                                          {p.price.toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP",
                                          })}
                                        </div>
                                      </>
                                    )}

                                    {p.name.includes(
                                      "Specialized Frame Custom Build"
                                    ) ||
                                    p.name.includes(
                                      "Wilier Filante Custom Build"
                                    ) ||
                                    p.name.includes(
                                      "Exploro Frame Custom Build"
                                    ) ? (
                                      <>
                                        <div className="mt-2">
                                          {p.customframeprice.toLocaleString(
                                            "en-PH",
                                            {
                                              style: "currency",
                                              currency: "PHP",
                                            }
                                          )}
                                        </div>
                                        <div className="mt-2">
                                          {p.customhandlebarprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customgroupsetprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customwheelsetprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customtireprice}
                                        </div>
                                        <div className="mt-2">
                                          {p.customsaddleprice}
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </>
                  )}
                </DialogContent>

                <div className="flex justify-between">
                  <DialogTitle
                    sx={{
                      height: "100px",
                      backgroundColor: "gray",
                      width: "75%",
                    }}
                  >
                    <div className="font-bebas">
                      <img src={logo} alt="" className="w-12" />
                      <div className="text-xs text-white w-[33rem]">
                        We're preparing your order with care and attention to
                        detail. If you have any special requests, please let us
                        know and we'll do our best to accommodate them.
                      </div>
                    </div>
                  </DialogTitle>

                  <DialogTitle
                    sx={{
                      backgroundColor: "orangered",
                      height: "100px",
                      width: "25%",
                    }}
                  >
                    {selectedOrder && (
                      <>
                        <div>
                          <h1 className="font-bebas text-xs justify-end flex">
                            Delivery Fee +{selectedOrder.deliveryFee}
                          </h1>
                          <h1 className="font-bebas text-sm justify-end flex">
                            total
                          </h1>
                          <h1 className="font-bebas text-2xl justify-end flex text-white">
                            {selectedOrder.totalPrice.toLocaleString("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            })}
                          </h1>
                        </div>
                      </>
                    )}
                  </DialogTitle>
                </div>

                <DialogContent>
                  <div className="flex items-center gap-1 font-bebas text-center mx-auto justify-center text-xs mt-4">
                    <TbCopyright /> Cyclecore est 2020
                  </div>
                </DialogContent>

                <DialogActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setDialogOpen(false)}
                  >
                    <span className="font-bebas font-bold tracking-wider text-lg">
                      Close
                    </span>
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
              >
                <DialogTitle>
                  <span className="flex items-center justify-between font-bebas tracking-wide">
                    Delete Order
                    <IoWarning className="text-yellow-300 mr-1" fontSize={32} />
                  </span>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <span className="font-bebas tracking-wide">
                      Are you sure you want to delete this order?
                    </span>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleDelete}
                  >
                    <span className="font-bebas tracking-wide">Delete</span>
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <span className="font-bebas tracking-wide">NO</span>
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}
