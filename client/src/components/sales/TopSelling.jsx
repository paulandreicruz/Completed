import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import moment from "moment";

export const TopSelling = () => {
  const [topSelling, setTopSelling] = useState([]);
  const [accumulatedOrders, setAccumulatedOrders] = useState([]);
  const [dailySalesCount, setDailySalesCount] = useState(0);
  const [thisWeekSales, setThisWeekSales] = useState(0);

  useEffect(() => {
    getTopSelling();
  }, []);

  const getTopSelling = async () => {
    try {
      const response = await axios.get("/hottestproducts");
      setTopSelling(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getDailySalesCount = async () => {
      try {
        const response = await axios.get("/daysales");
        const data = response.data.totalSales;
        const currentDaySales = data.length > 0 ? data[0].total : 0;
        const orders = data.length > 0 ? data[0].orders : [];
        setDailySalesCount(currentDaySales);
        setAccumulatedOrders(orders);
      } catch (error) {
        console.error(error);
      }
    };

    getDailySalesCount();
  }, []);

  return (
    <>
      <div className="w-full shadow-md">
        <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
          <div className="font-bold text-lg tracking-wide">
            <div className="flex items-center gap-1">
              Sales This Day
              <BsFillPiggyBankFill className="text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 text-sm">Orders</div>
          </div>

          <NavLink to="/dashboard/admin/products">
            <button className="px-1.5 border-2 border-gray-400 hover:border-gray-500 rounded-full font-bold tracking-wide">
              View Products
            </button>
          </NavLink>
        </div>
        <div className="p-4 bg-white">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-100 tracking-wide text-xl">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">total Price</th>
                <th className="p-2">total quantity</th>
                <th className="p-2">Sales This Day</th>
              </tr>
            </thead>
            {accumulatedOrders.map((orders) => (
              <tbody key={orders._id}>
                {orders.products.map((o, i) => (
                  <tr key={o._id} className="border-b">
                    {/* <td className='p-2'>{orders.ordernumber}</td> */}
                    <td className="flex items-center gap-3">
                      <div>
                        <img
                          src={`${
                            import.meta.env.VITE_APP_REACT_APP_API
                          }/product/photo/${o._id}`}
                          alt=""
                          className="w-16"
                        />
                      </div>
                      <div>
                        <h1 className="text-sm font-oswald">{o.name}</h1>
                        <h1 className="text-xs font-oswald">
                          {orders.ordernumber}
                        </h1>
                      </div>
                    </td>
                    <td className="p-2">
                      {orders.totalPrice.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </td>
                    <td className="p-2">{orders.totalQuantity}</td>
                    <td className="p-2">
                      {moment(orders.createdAt).format("MMMM Do YYYY, h:mm:ss")}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};
