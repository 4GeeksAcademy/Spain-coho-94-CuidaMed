import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const EmergencyContactQR = ({phoneContact}) => {
  return (
    <div className="container">
      
      {phoneContact && (
        <div className="text-center ">
          <QRCodeSVG value={`tel:${phoneContact}`} size={180} marginSize={1}/>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactQR;
