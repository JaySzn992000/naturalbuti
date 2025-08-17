import React from "react";
import Navbar from "../headers_footer/navbar";
import Header from "../headers_footer/header";
import './ReturnPolicy.css';

const ReturnPolicy = () => {

return (

<div>

<Navbar></Navbar>

<div className="return_flex_">

<div>

<h2>Return Policy</h2>

<p>We kindly request all customers to carefully review our Return Policy available on this website before proceeding with any purchases. The Return Policy outlines important information regarding eligibility, conditions for returns or exchanges, applicable timelines, and other essential terms. Familiarizing yourself with this policy will help ensure a smooth shopping experience and avoid any confusion or misunderstandings later. By placing an order on our site, you acknowledge that you have read, understood, and agreed to our Return Policy.
</p>

<h2>User Registration</h2>

<p>
{" "}
You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
{" "}
</p>

</div>

</div>

<div className="return_flex_tw">

<h4>Products</h4>

<p>
We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
</p>

</div>

{/*  */}

<Header></Header>

</div>

)

}

export default ReturnPolicy;
