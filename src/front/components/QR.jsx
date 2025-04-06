import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const EmergencyContactQR = ({phoneContact}) => {
  return (
    <div className="container">
      
      {phoneContact && (
        <div className="text-center mt-4">
          <QRCodeSVG value={`tel:${phoneContact}`} size={180} />
        </div>
      )}
    </div>
  );
};

export default EmergencyContactQR;
