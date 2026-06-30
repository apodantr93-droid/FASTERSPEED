import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface QRCodeModalProps {
  trackingNumber: string;
  shipmentInfo?: { sender?: string; receiver?: string; governorate?: string };
  onClose: () => void;
}

export default function QRCodeModal({ trackingNumber, shipmentInfo, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200">
        <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-1">رقم التتبع</h3>
          <p className="text-sm text-slate-400 mb-4">استخدم هذا الرقم أو امسح QR Code للتتبع</p>

          {/* Tracking Number */}
          <div className="bg-slate-900 rounded-lg p-4 mb-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-400 font-mono tracking-wider">{trackingNumber}</span>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="نسخ"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl p-6 inline-block mb-4">
            <QRCodeSVG
              value={trackingNumber}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Shipment Info */}
          {shipmentInfo && (
            <div className="text-sm text-slate-400 space-y-1 mb-4">
              {shipmentInfo.sender && <p>الراسل: <span className="text-white">{shipmentInfo.sender}</span></p>}
              {shipmentInfo.receiver && <p>المستلم: <span className="text-white">{shipmentInfo.receiver}</span></p>}
              {shipmentInfo.governorate && <p>المحافظة: <span className="text-white">{shipmentInfo.governorate}</span></p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
