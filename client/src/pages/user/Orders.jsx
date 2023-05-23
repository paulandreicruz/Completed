import Navbar from "../../global/nav/Navbar";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/Auth";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Paper,
} from "@mui/material";
import moment from "moment";
import { TiArrowBackOutline, TiPrinter } from "react-icons/ti";
import { TbCopyright, TbTruckReturn } from "react-icons/tb";
import { BsCloudSun } from "react-icons/bs";
import logo from "../../assets/logo1.png";
import ReactToPrint from "react-to-print";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UserOrders() {
  const printButton = "@media print { .print-button { hidden: true}}";
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [openCancel, setOpenCancel] = useState(false);

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [refundRequest, setRefundRequest] = useState(
    "`Refund Request for Order ID ${o.ordernumber}: I request a refund for order ${o.ordernumber} due to dissatisfaction. Please process the refund promptly. Thank you.`"
  );

  const handleRefundRequestChange = (e) => {
    setRefundRequest(e.target.value);
  };

  const handlePrint = () => {
    window.print();
    document.title = "order#: " + orderId;
  };

  const navigate = useNavigate();

  const handleOrderDetailsClick = (orders) => {
    setDialogOpen(true);
    setSelectedOrder(orders);
    setSelectedOrderProducts(orders.products);
  };

  const handleRefundForm = (orders) => {
    setOpenCancel(true);
    setSelectedOrder(orders);
    setSelectedOrderProducts(orders.products);
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const componentRef = useRef(null);

  const customBuilds = [
    "Specialized Frame Custom Build",
    "Wilier Filante Custom Build",
    "Exploro Frame Custom Build",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order / Refund",
    orderid: "",
    message: "",
  });

  const { name, email, subject, message, ordernumber } = formData;

  const handleSwitch = () => {
    setShowContactInfo(!showContactInfo);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(formData);

      await axios.post("/send-email", body, config);

      toast.success("Email sent successfully", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          width: "300px",
          height: "20px",
          fontSize: "17px",
          fontFamily: "Bebas Neue",
        },
      });
      setOpenCancel(false);
    } catch (err) {
      console.log(err);
      toast.error("Error sending email", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          width: "300px",
          height: "20px",
          fontSize: "17px",
          fontFamily: "Bebas Neue",
        },
      });
    }
  };

  return (
    <div
      className={`bg-gray-200 ${orders.length >= 3 ? "h-full" : "h-screen"}`}
    >
      <Navbar />

      <style>
        {`
          @media print {
            .print-button {
              display: none;
            }
          }
        `}
      </style>

      <Paper className="p-3 mx-24 mt-5 mb-0 font-bebas">
        <div className="flex items-center justify-between">
          <span className="tracking-wide flex hover:text-[#00BFFF] hover:cursor-default">
            Orders <TbTruckReturn fontSize={21} className="pt-[1px] ml-0.5" />
          </span>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<TiArrowBackOutline />}
            size="small"
            onClick={() => navigate("/")}
          >
            <span className="font-bebas tracking-wide pt-0.5 text-sm">
              Go Back
            </span>
          </Button>
        </div>
      </Paper>
      {orders?.map((o) => (
        <Paper
          sx={{ backgroundColor: "#f2f2f2" }}
          className="px-4 pb-4 mx-24 mt-5 font-bebas"
          key={o._id}
        >
          <div className="flex items-center py-3">
            <div className="flex gap-32 flex-1">
              <div className="tracking-wide text-sm">
                {" "}
                Order ID :{" "}
                <span className="font-semibold font-oswald text-sm">
                  {o.ordernumber}
                </span>
              </div>
              <div className="text-sm">
                Order Date:{" "}
                <span className="text-sm font-oswald font-bold">
                  {moment(o.createdAt).format("MMMM Do YYYY, h:mm:ss")}
                </span>
              </div>

              <div className="text-sm">
                Status:{" "}
                <span className="text-sm font-bold font-oswald">
                  {o.status}
                </span>
              </div>
            </div>

            <div>
              <button
                className="p-2 border border-red-500 rounded-md"
                onClick={() => handleRefundForm(o)}
              >
                Cancel / Refund
              </button>
            </div>
          </div>

          <Paper className="p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="tracking-wide text-xs">{o.deliveryOption}</h1>
                <h1 className="flex font-oswald gap-1 text-lg">
                  {o.estimatedDelivery}
                  <BsCloudSun />
                </h1>
              </div>

              <div className="flex gap-4">
                <Button variant="text">
                  <span
                    className="font-bebas tracking-wider underline"
                    onClick={() => handleOrderDetailsClick(o)}
                  >
                    Order Details
                  </span>
                </Button>
              </div>
            </div>

            <div className="h-[1px] bg-gray-300 my-4" />

            <div className="flex justify-between">
              <div className="space-y-4">
                {o?.products?.map((p, i) => (
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <img
                          src={`${
                            import.meta.env.VITE_APP_REACT_APP_API
                          }/product/photo/${p._id}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = p.image;
                          }}
                          className="w-24 rounded-sm"
                        />
                      </div>

                      <div>
                        <div className="text-sm">
                          Name:{" "}
                          <span className="text-sm font-oswald">{p.name}</span>
                        </div>
                        <div className="text-sm">
                          Qty:{" "}
                          <span className="text-sm font-oswald">
                            {p.quantity}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-sm font-oswald">
                            {" "}
                            {p.price.toLocaleString("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Paper>
          {/* dialog */}
        </Paper>
      ))}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        ref={componentRef}
        maxWidth="xl"
      >
        <DialogTitle sx={{ backgroundColor: "gray", width: "100%" }}>
          <div className="flex justify-between w-full text-white">
            <div className="font-bebas">
              <img src={logo} alt="" className="w-44" />
              <h1 className="tracking-wider text-6xl font-bold">Invoice</h1>
            </div>

            <div className="space-y-2 font-bebas mt-8">
              <h1 className="text-xl font-bold tracking-wider">
                Cyclecore Bikeshop
              </h1>
              <h1 className="font-oswald text-xs">
                390 Col. Bonny Serrano Ave, Project 4
              </h1>
              <h1 className="font-oswald text-xs">Quezon City, Metro Manila</h1>
              <h1 className="font-oswald text-xs">Manila, Philippines</h1>
              <h1 className="tracking-wide text-xs">1192</h1>
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
                      {selectedOrder.payment?.transaction?.creditCard?.cardType
                        ? selectedOrder.payment?.transaction?.creditCard
                            ?.cardType
                        : selectedOrder.paymentOption}
                    </span>
                  </div>
                  <div className="text-sm">
                    Card Type:{" "}
                    <span className="font-bold text-xs font-oswald">
                      {selectedOrder.payment?.transaction?.paymentInstrumentType
                        ? selectedOrder.payment?.transaction
                            ?.paymentInstrumentType
                        : " None "}
                    </span>
                  </div>
                  <div className="text-sm">
                    Transaction ID:{" "}
                    <span className="font-bold font-oswald text-xs">
                      {selectedOrder.payment?.transaction.id ||
                        selectedOrder.paymentId ||
                        "None"}
                    </span>
                  </div>
                  <h1 className="text-xs">
                    order id#:{" "}
                    <span className="font-bold text-xs font-oswald">
                      {selectedOrder.ordernumber}
                    </span>
                  </h1>
                  <h1 className="text-xs">
                    Payment Status:{" "}
                    <span className="font-bold text-xs font-oswald">
                      {selectedOrder.payment?.success &&
                      !selectedOrder.paymentId
                        ? "Success"
                        : selectedOrder.payment?.success === false &&
                          !selectedOrder.paymentId
                        ? "Failed"
                        : selectedOrder.paymentId
                        ? selectedOrder.paypalpayment.state
                        : ""}
                    </span>
                  </h1>
                  <h1 className="text-xs">
                    Shipping Status:{" "}
                    <span
                      className={`tracking-wider text-xs font-oswald font-bold ${
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
                  <h1 className="font-bold text-lg tracking-wide">Item</h1>
                </div>
                <div className="flex space-x-20 text-lg font-bebas">
                  <h1 className="font-bold">Quantity</h1>
                  <h1 className="font-bold">Price</h1>
                  <h1 className="font-bold">Amount</h1>
                </div>
              </div>
              {selectedOrder.products.map((p, i) => (
                <>
                  <div key={i} className="font-bebas flex justify-between">
                    <div className="font-oswald text-xs">
                      {customBuilds.some((build) =>
                        p.name.includes(build)
                      ) ? null : (
                        <>
                          <div className="mt-2">{p.name}</div>
                        </>
                      )}
                      {customBuilds.some((build) => p.name.includes(build)) && (
                        <>
                          <div className="mt-2">{p.customframename}</div>
                          <div className="mt-2">{p.customhandlebarname}</div>
                          <div className="mt-2">{p.customgroupsetname}</div>
                          <div className="mt-2">{p.customwheelsetname}</div>
                          <div className="mt-2">{p.customtirename}</div>
                          <div className="mt-2">{p.customtsaddlename}</div>
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
                                  <div className="mt-2">{p.quantity}</div>
                                )}
                                <div className="mt-2">{p.quantity}</div>
                                <div className="mt-2">{p.quantity}</div>
                                <div className="mt-2">{p.quantity}</div>
                                <div className="mt-2">{p.quantity}</div>
                                {p.name.includes(
                                  "Wilier Filante Custom Build"
                                ) ? null : (
                                  <div className="mt-2">{p.quantity}</div>
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
                            p.name.includes("Wilier Filante Custom Build") ||
                            p.name.includes("Exploro Frame Custom Build") ? (
                              <>
                                <div className="mt-2">{p.customframeprice}</div>
                                <div className="mt-2">
                                  {p.customhandlebarprice}
                                </div>
                                <div className="mt-2">
                                  {p.customgroupsetprice}
                                </div>
                                <div className="mt-2">
                                  {p.customwheelsetprice}
                                </div>
                                <div className="mt-2">{p.customtireprice}</div>
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
                            p.name.includes("Wilier Filante Custom Build") ||
                            p.name.includes("Exploro Frame Custom Build") ? (
                              <>
                                <div className="mt-2">{p.customframeprice}</div>
                                <div className="mt-2">
                                  {p.customhandlebarprice}
                                </div>
                                <div className="mt-2">
                                  {p.customgroupsetprice}
                                </div>
                                <div className="mt-2">
                                  {p.customwheelsetprice}
                                </div>
                                <div className="mt-2">{p.customtireprice}</div>
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
            sx={{ height: "100px", backgroundColor: "gray", width: "75%" }}
          >
            <div className="font-bebas">
              <img src={logo} alt="" className="w-12" />
              <div className="text-xs text-white w-[33rem]">
                We're preparing your order with care and attention to detail. If
                you have any special requests, please let us know and we'll do
                our best to accommodate them.
              </div>
            </div>
          </DialogTitle>

          <DialogTitle
            sx={{ backgroundColor: "orangered", height: "100px", width: "25%" }}
          >
            {selectedOrder && (
              <>
                <div>
                  <h1 className="font-bebas text-sm justify-end flex">
                    Delivery Fee +{selectedOrder.deliveryFee}
                  </h1>
                  <h1 className="font-bebas text-sm justify-end flex">total</h1>
                  <h1 className="font-bebas text-3xl justify-end flex text-white">
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
          {selectedOrder && (
            <ReactToPrint
              trigger={() => {
                return (
                  <div
                    className={`hover:underline hover:text-orange-500 cursor-pointer font-bebas flex items-center print-button`}
                  >
                    <TiPrinter /> print invoice
                  </div>
                );
              }}
              content={() => componentRef.current}
              pageStyle="@media print {.MuiDialogTitle-root {-webkit-print-color-adjust: exact; print-color-adjust: exact;}}"
              style={{ display: "none" }}
              documentTitle={`order#: ${selectedOrder._id}`}
            />
          )}
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>Order / Refund Form</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <div>
                <div className="flex justify-between ">
                  {/* Page Title */}
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-blue-500 text-xl font-bebas tracking-wider font-semibold leading-relaxed">
                      Refund Form
                    </h2>

                    <h2 className="font-oswald">
                      <span className="font-bebas text-sm">
                        Your Order Number:
                      </span>{" "}
                      <span className="text-sm font-medium">
                        {selectedOrder.ordernumber}
                      </span>
                    </h2>
                  </div>

                  <h2
                    onClick={handleSwitch}
                    id="switch_to_contact_info"
                    className="text-red-800 text-xs flex font-bebas tracking-wider flex-row items-center font-semibold md:hidden cursor-pointer"
                  >
                    Contact Info
                    <HiOutlineChevronDoubleRight />
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="font-oswald">
                  <input
                    type="text"
                    name="name"
                    id=""
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={handleChange}
                    required
                    className="w-full text-xs px-3 h-8 my-2 outline-none rounded-md border focus:shadow-sm focus-within:scale-110"
                  />

                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    required
                    className="w-full text-xs px-3 h-8 my-2 outline-none rounded-md border focus:shadow-sm focus-within:scale-110"
                  />

                  <input
                    disabled
                    type="text"
                    name="subject"
                    id="subject"
                    value={subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject"
                    className="w-full cursor-not-allowed text-xs px-3 h-8 my-2 outline-none rounded-md border focus:shadow-sm focus-within:scale-110"
                  />

                  <input
                    type="text"
                    name="ordernumber"
                    id="ordernumber"
                    value={ordernumber}
                    onChange={handleChange}
                    required
                    placeholder="Order Id"
                    className="w-full text-xs px-3 h-8 my-2 outline-none rounded-md border focus:shadow-sm focus-within:scale-110"
                  />

                  <textarea
                    name="message"
                    id="message"
                    value={message}
                    onChange={handleChange}
                    required
                    placeholder="Enter Your Concerns"
                    className="w-full text-xs px-3 h-20 my-2 outline-none rounded-md border focus:shadow-sm resize-none focus-within:scale-110"
                  />

                  <button
                    type="submit"
                    className="flex items-center gap-1 bg-[#FFA500] hover:scale-105 font-bebas tracking-widest duration-500 px-4 py-2 rounded-md text-xs cursor-pointer hover:shadow-md max-w-md uppercase "
                  >
                    <FiSend /> <span className="tracking-[2px]">send</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
