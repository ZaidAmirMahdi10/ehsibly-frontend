// im-app/src/components/PrintTable.js
import React from 'react';
import './PrintTable.css';

const FlexRow = ({ children }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    justifyContent: 'space-between',
    width: '100%',
    padding: '15px',
  }}>
    {children}
  </div>
);

const FlexColumn = ({ children }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    {children}
  </div>
);

const FontWeight600 = ({ children }) => (
  <span style={{ fontWeight: '600' }}>
    {children}
  </span>
);

const PrintTable = ({ data }) => {
  return (
    <div className="print-container">
      {data.map((row, index) => (
        <div key={index} className="invoice-block">

          <div className="print-row">
            <FlexRow>
              <FlexColumn>
                <FontWeight600>Invoice Number:</FontWeight600>
                <span>{row.invoiceNumber}</span>
              </FlexColumn>

              <FlexColumn>
                <FontWeight600>Customer Name:</FontWeight600>
                <span>{row.customerName}</span>
              </FlexColumn>

              <FlexColumn>
                <FontWeight600>Company Name:</FontWeight600>
                <span>{row.companyName}</span>
              </FlexColumn>
            </FlexRow>
          </div>

          <div className="print-row">
            <FlexRow>
                <FlexColumn>
                    <FontWeight600>Container Number:</FontWeight600>
                    <span>{row.containerNumber}</span>
                </FlexColumn>
                
                <FlexColumn>
                    <FontWeight600>SWIFT:</FontWeight600>
                    <span>{row.swift}</span>
                </FlexColumn>

                <FlexColumn>
                    <FontWeight600>Date:</FontWeight600>
                    <span>{new Date(row.date).toLocaleDateString()}</span>
                </FlexColumn>
            </FlexRow>
        </div>

        <div className="print-row">
            <FlexRow>
                <FlexColumn>
                    <FontWeight600>Amount In Dinar:</FontWeight600>
                    <span>{row.amountDinar}</span>
                </FlexColumn>

                <FlexColumn>
                    <FontWeight600>Currency Rate:</FontWeight600>
                    <span>{row.amountOtherCurrency} {row.otherCurrency}</span>
                </FlexColumn>
            </FlexRow>            
        </div>

        <div className="print-row">
            <FlexRow>
                <FlexColumn>
                    <FontWeight600>Received:</FontWeight600>
                    <span>{row.received}</span>
                </FlexColumn>

                <FlexColumn>
                    <FontWeight600>Left:</FontWeight600>
                    <span>{row.left}</span>
                </FlexColumn>
            </FlexRow>
        </div>

        <div className="print-row">
            <FlexRow>
                <FlexColumn>
                    <FontWeight600>Notes:</FontWeight600>
                    <span>{row.notes}</span>
                </FlexColumn>
            </FlexRow>
        </div>
          
        </div>
      ))}
    </div>
  );
};

export default PrintTable;
