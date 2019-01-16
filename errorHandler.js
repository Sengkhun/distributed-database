export default ({ status, message }, req, res, next) => {
  res.json({
    status: status || 500,
    message: message || 'Something broke!',
    data: null,
    type: 0
  });
};
