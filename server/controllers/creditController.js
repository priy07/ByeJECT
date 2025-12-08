// Payment functionality removed. These stub handlers remain to avoid import errors if any.
export const getPlans = async (req, res) => {
  return res.status(410).json({ success: false, message: 'Payment functionality removed' });
}

export const purchasePlan = async (req, res) => {
  return res.status(410).json({ success: false, message: 'Payment functionality removed' });
}