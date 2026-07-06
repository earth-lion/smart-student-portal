import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CreditCard, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Financials() {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFinancialData = async () => {
    if (!user?.student_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/students/${user.student_id}`);
      setFinancialData(res.data.financial_data);
    } catch (err) {
      toast.error('فشل تحميل البيانات المالية');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [user]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user?.student_id || !financialData) return;
    setIsProcessing(true);
    try {
      const res = await api.post('/student/pay', {
        student_id: user.student_id,
        amount: financialData.total_due,
      });
      setFinancialData(res.data.financial_data);
      toast.success(res.data.message || 'تمت عملية الدفع بنجاح! تم تحديث رصيدك الأكاديمي.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إتمام عملية الدفع');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <span className="spinner" style={{ display: 'inline-block', width: '30px', height: '30px' }} />
        <p style={{ marginTop: '10px', color: 'var(--text-gray)' }}>جاري تحميل البيانات المالية...</p>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="card fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
        <p>عذراً، لم يتم العثور على سجل مالي لهذا الطالب.</p>
      </div>
    );
  }

  const remaining = financialData.total_due;

  return (
    <div className="card fade-in">
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CreditCard size={24} style={{ color: 'var(--accent)' }} />
        الماليات والرسوم الدراسية
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px' }}>إجمالي المصروفات (رسوم + مواد)</p>
          <strong style={{ fontSize: '24px', color: 'var(--text-color, #020e2e)' }}>{financialData.total_amount?.toLocaleString()} ج.م</strong>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
          <p style={{ margin: '0 0 8px', color: '#065f46', fontSize: '14px' }}>المدفوع</p>
          <strong style={{ fontSize: '24px', color: '#10b981' }}>{financialData.paid_amount?.toLocaleString()} ج.م</strong>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', background: remaining > 0 ? '#fef2f2' : 'var(--card-bg, #f8fafc)', border: remaining > 0 ? '1px solid #fecaca' : '1px solid var(--border-color, #e2e8f0)' }}>
          <p style={{ margin: '0 0 8px', color: remaining > 0 ? '#991b1b' : '#64748b', fontSize: '14px' }}>المتبقي</p>
          <strong style={{ fontSize: '24px', color: remaining > 0 ? '#ef4444' : 'var(--text-color, #020e2e)' }}>{remaining?.toLocaleString()} ج.م</strong>
        </div>
      </div>

      {remaining > 0 ? (
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', color: 'var(--text-color)' }}>الدفع الإلكتروني (بوابة الدفع التجريبية)</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <label style={{ flex: 1, minWidth: '200px', padding: '16px', border: paymentMethod === 'card' ? '2px solid var(--accent)' : '1px solid var(--border-color, #e2e8f0)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg-light)' }}>
              <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ accentColor: 'var(--accent)' }} />
              <CreditCard size={20} />
              <span style={{ fontWeight: 600 }}>بطاقة ائتمانية / ميزة</span>
            </label>
            <label style={{ flex: 1, minWidth: '200px', padding: '16px', border: paymentMethod === 'fawry' ? '2px solid var(--accent)' : '1px solid var(--border-color, #e2e8f0)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg-light)' }}>
              <input type="radio" name="payment" checked={paymentMethod === 'fawry'} onChange={() => setPaymentMethod('fawry')} style={{ accentColor: 'var(--accent)' }} />
              <div style={{ background: '#facc15', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: '#000' }}>F</div>
              <span style={{ fontWeight: 600 }}>فوري (Fawry)</span>
            </label>
          </div>

          <form onSubmit={handlePayment}>
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-gray, #475569)' }}>رقم البطاقة</label>
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--input-bg)', color: 'var(--text-color)' }} required />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-gray, #475569)' }}>تاريخ الانتهاء</label>
                    <input type="text" placeholder="MM/YY" maxLength="5" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--input-bg)', color: 'var(--text-color)' }} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-gray, #475569)' }}>الرقم السري (CVV)</label>
                    <input type="text" placeholder="123" maxLength="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--input-bg)', color: 'var(--text-color)' }} required />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-gray, #475569)' }}>الاسم على البطاقة</label>
                  <input type="text" placeholder="الاسم ثلاثي" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--input-bg)', color: 'var(--text-color)' }} required />
                </div>
              </div>
            )}

            {paymentMethod === 'fawry' && (
              <div style={{ marginBottom: '24px', padding: '16px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' }}>
                <p style={{ color: '#92400e', marginBottom: '8px' }}>سيتم إنشاء رقم مرجعي للدفع، يمكنك التوجه لأي ماكينة فوري والدفع باستخدام هذا الرقم.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309' }}>
                  <AlertTriangle size={16} /> مدة صلاحية الرقم المرجعي 24 ساعة فقط.
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              style={{ width: '100%', padding: '14px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isProcessing ? 'جاري المعالجة...' : `دفع مبلغ ${remaining?.toLocaleString()} ج.م`}
              {!isProcessing && <ShieldCheck size={18} />}
            </button>
            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> بوابة دفع آمنة ومشفرة
            </p>
          </form>
        </div>
      ) : (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#10b981', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ color: '#065f46', fontSize: '20px', marginBottom: '8px' }}>لا توجد مديونيات مستحقة</h3>
          <p style={{ color: '#047857' }}>لقد قمت بسداد كافة الرسوم الدراسية للفصل الدراسي الحالي بنجاح. نتمنى لك فصلاً دراسياً موفقاً!</p>
        </div>
      )}
    </div>
  );
}
