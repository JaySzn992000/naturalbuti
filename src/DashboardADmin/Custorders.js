import React, { useEffect, useState } from "react";
import DashboardNav from "../DashboardNav";
import DashboardSlider from "../DashboardSlider";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import "./Custorders.css";

function Custorders() {

  const [customerOrder, setCustomerOrder] = useState([]);
  const [allCustomerOrders, setAllCustomerOrders] = useState([]);
  const [totalcustProducts, setTotalcustProducts] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [navContainer, setNavContainer] = useState(false);
  const [relative_CustordersCon, setRelativeCustordersCon] = useState(false);

  const navigate = useNavigate();

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) navigate("/adminlogin");
  }, [navigate]);

  /* ================= FETCH ORDERS ================= */
  const customerFetch = async () => {
    try {
      const response = await fetch(
        "https://naturalbuti.onrender.com/fetchCutomerOrder"
      );
      const data = await response.json();

      setCustomerOrder(data.products);
      setAllCustomerOrders(data.products);
      setTotalcustProducts(data.total);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    customerFetch();
  }, []);

  /* ================= SIDEBAR ================= */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setNavContainer(!navContainer);
    setRelativeCustordersCon(!relative_CustordersCon);
  };

  /* ================= FILTER ================= */
  const handleFilterSubmit = () => {
    if (!selectedDate) {
      customerFetch();
      return;
    }

    const filterDate = new Date(selectedDate);

    const filteredOrders = allCustomerOrders.filter(order => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getFullYear() === filterDate.getFullYear() &&
        orderDate.getMonth() === filterDate.getMonth() &&
        orderDate.getDate() === filterDate.getDate()
      );
    });

    setCustomerOrder(filteredOrders);
    setTotalcustProducts(filteredOrders.length);
  };

  /* ================= DATE FORMAT ================= */
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId) => {
    try {
      const response = await fetch(
        "https://naturalbuti.onrender.com/updateOrderStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_order_id: orderId }),
        }
      );

      const result = await response.json();

      if (result.success || result.message === "updated") {
        await customerFetch(); // 🔥 MAIN FIX
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Customer Orders Dashboard | Pickle Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardNav
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        navContainer={navContainer}
      />

      <DashboardSlider sidebarOpen={sidebarOpen} />

      <div className={`Parent_relativeCust ${relative_CustordersCon ? "relative_Custorders_inside" : ""}`}>
        <h3 className="custorders-header">
          Orders Placed : {totalcustProducts}
        </h3>

        <div className="filter-container">
          <label>Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={handleFilterSubmit}>Apply Filter</button>
        </div>

        <div className="custorders-container">
          <table className="custorders-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Product</th>
                <th>Product Name</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customerOrder.map((order, index) => (
                <tr key={index}>
                  <td># {order.id}</td>

                  <td>
                    {order.file_path && (
                      <img
                        src={order.file_path}
                        alt=""
                        width="45"
                        height="45"
                        style={{ borderRadius: "6px" }}
                      />
                    )}
                  </td>

                  <td>{order.productname}</td>
                  <td>{order.name}</td>
                  <td>{order.mob}</td>
                  <td>{order.email}</td>
                  <td>{order.payment_status}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>₹ {order.amount}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status_order}</td>

                  <td>
                    <button
                      className="custOrderBtn"
                      disabled={order.status_order === "Delivered"}
                      onClick={() => updateStatus(order.razorpay_order_id)}
                    >
                      {order.status_order === "Delivered"
                        ? "Delivered"
                        : "Mark as Delivered"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default Custorders;
