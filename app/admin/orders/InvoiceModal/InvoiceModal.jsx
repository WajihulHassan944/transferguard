"use client";

import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../../thankyou-for-purchase/thankyou.css";
import "../../../status/thank.css";
import { baseUrl } from "@/const";
import "./invoiceModal.css";

export default function InvoiceModal({ orderId, onClose }) {
  const invoiceRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch invoice by ID
  useEffect(() => {
    if (!orderId) return;

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/wallet/getInvoiceById/${orderId}`);
        const data = await res.json();
        if (data?.success) {
          setOrder(data.invoice);
        }
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
        <div className="bg-white p-6 rounded-lg shadow-md">
          Loading invoice...
        </div>
      </div>
    );
  }

  if (!order) return null;

  // Group credits
  const groupCredits = (credits = []) => {
    const map = new Map();
    credits.forEach((c) => {
      const key = `${c.credits}-${c.amount || 0}-${c.isManual}`;
      if (!map.has(key)) {
        map.set(key, {
          credits: c.credits,
          amount: c.amount,
          isManual: c.isManual,
          quantity: 1,
        });
      } else {
        map.get(key).quantity += 1;
      }
    });
    return [...map.values()];
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current || !order) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`${order.invoiceNumber || "invoice"}.pdf`);
  };

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal-top">
        {/* Download button */}
        <div className="invoice-btn-row">
          <button onClick={downloadPDF} className="download-btn-success">
            Download Invoice
          </button>
        </div>
        <button className="invoice-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Invoice Preview */}
      <div className="specialinvoicewrapper p-6">
        <div className="invoice-preview thankpageinvoice" ref={invoiceRef}>
          <div className="invoice-top-border" />
          <div className="spaced-div">
            <div className="invoice-logo">XCLUSIVE 3D</div>
            <img src="/logoMain.png" alt="logo" className="invoice-logo-img" />
          </div>

          <div className="invoice-header">
            <div className="invoice-info-left">
              <div className="invoice-title">INVOICE</div>
              <div className="invoice-contact">
                <div>info@XclusiveVR.com</div>
                <div className="blueColored">
                  VAT number: <br />
                  <strong>NL002166652B18</strong>
                </div>
                <div className="lightBlueColored">CoC: 34270611</div>
                <div className="lightBlueColored">The Netherlands</div>
              </div>
            </div>

            <div className="invoice-info-right">
              <div className="billing-block">
                <div>{order.billingInfo?.name || `${order.user.firstName} ${order.user.lastName}` || "Customer name not provided"}</div>
                <div>{order.billingInfo?.companyName || "Company not specified"}</div>
                {order.billingInfo?.street ? (
                  <div>
                    {order.billingInfo.street}
                    <br />
                    {order.billingInfo.postalCode} {order.billingInfo.city}
                    <br />
                    {order.billingInfo.countryName}
                  </div>
                ) : (
                  <div>No billing address provided</div>
                )}

                <div className="invoice-meta">
                  <div className="meta-row">
                    <div className="meta-label">VAT Number:</div>
                    <div className="meta-value">
                      {order.billingInfo?.vatNumber || "Not provided"}
                    </div>
                  </div>
                  <div className="meta-row">
                    <div className="meta-label">Date:</div>
                    <div className="meta-value">
                      {new Date(order.issuedAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                  <div className="meta-row">
                    <div className="meta-label">Invoice Number:</div>
                    <div className="meta-value">{order.invoiceNumber}</div>
                  </div>
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupCredits(order.credits).map((c, idx) => (
                      <tr key={idx}>
                        <td>
                          {c.isManual
                            ? `${c.credits} Credits (Added by Admin)`
                            : `${c.credits} Credits for 3D conversion`}
                        </td>
                        <td>{c.quantity}</td>
                        <td>
                          {c.isManual
                            ? "Added by Admin"
                            : `${order.currency} ${c.amount
                                ?.toFixed(2)
                                .replace(".", ",")}`}
                        </td>
                      </tr>
                    ))}

                    <tr style={{ borderBottom: "2px solid #000" }}>
                      <td style={{ height: "45px" }}></td>
                      <td style={{ height: "45px" }}></td>
                      <td style={{ height: "45px" }}></td>
                    </tr>
  {!order.credits.every((c) => c.isManual) && (
                   
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        {order.currency}{" "}
                        {order.amount?.toFixed(2).replace(".", ",")}
                      </td>
                      
                      
                    </tr>
 )}
                    {order.discountAmount > 0 && (
                      <tr>
                        <td></td>
                        <td>Discount ({order.couponCode || ""})</td>
                        <td>
                          -{order.currency}{" "}
                          {order.discountAmount?.toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    )}

                    {(order.vat > 0 || order.vatRate > 0) && (
                      <tr>
                        <td></td>
                        <td>VAT</td>
                        <td>
                          {order.currency}{" "}
                          {order.vat?.toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    )}
{!order.credits.every((c) => c.isManual) && (
                    <tr className="total" style={{ borderBottom: "2px solid #000" }}>
                      <td></td>
                      <td></td>
                      <td>
                        {order.currency}{" "}
                        {order.total?.toFixed(2).replace(".", ",")}
                      </td>
                    </tr> )}
                  </tbody>
                </table>

                <div className="invoice-footer">
                  {order.vatNote !== "" ? "VAT Reversed" : ""} <br />
                  Payment method: {order.method} <br />
                  Credits are valid for 1 year (365 days) <br />
                  Thank you for your order and enjoy our immersive 3D
                  conversion.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
