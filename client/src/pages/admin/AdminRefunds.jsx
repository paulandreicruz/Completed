import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export const RefundedOrders = () => {
  const [getRefund, setGetRefund] = useState([]);

  useEffect(() => {
    getRefunded();
  }, []);

  const getRefunded = async () => {
    try {
      const response = await axios.get("/refunds");
      setGetRefund(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-10 px-20">
      <div className="bg-white p-3">
        <div className="font-bebas text-xl font-bold tracking-wide border-b py-2 px-3">
          Refunded Orders
        </div>
        <div className="p-3">
          <table className="mx-auto w-full">
            <thead className="border-b text-left">
              <tr>
                <th>Product</th>
                <th>Buyer</th>
                <th>Status</th>
                <th>Email</th>
                <th>Price</th>
              </tr>
            </thead>

            {getRefund.map((order, i) => (
              <>
                <tbody key={i}>
                  {order.products.map((o) => (
                    <>
                      <tr key={o._id} className="border-b">
                        <td>
                          <div className="flex gap-1">
                            <div>
                              <img
                                src={`${
                                  import.meta.env.VITE_APP_REACT_APP_API
                                }/product/photo/${o._id}`}
                                alt=""
                                className="w-12"
                              />
                            </div>
                            <div className="">
                              <div>{o?.name}</div>

                              <div className="flex items-center gap-1">
                                <div>{order.ordernumber}</div>

                                <div className="w-[1.2px] h-[18px] bg-black" />

                                <div>
                                  {moment(order.createdAt).format(
                                    "MMMM Do YYYY, h:mm:ss"
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          {order.buyer.firstname} {order.buyer.lastname}
                        </td>

                        <td>{order.status}</td>

                        <td>{order.buyer.email}</td>

                        <td>{o.price}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};
