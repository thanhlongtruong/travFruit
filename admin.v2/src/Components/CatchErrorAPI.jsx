import PropTypes from "prop-types";

function CatchErrorAPI({ error }) {

  return (
    <div className="bg-zinc-800 p-3 text-red-600">
      <p className="uppercase tracking-widest">Lỗi !!!</p>
      <p>Code: {error?.code}</p>
      <p>response: {error?.response?.config?.url}</p>
      <div>
        <p>message: {error?.response?.data?.message}</p>
        <p>
          error:{" "}
          {error?.response?.data?.error?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.errors ||
            "Không có error"}
        </p>
      </div>
    </div>
  );
}
CatchErrorAPI.propTypes = {
  error: PropTypes.object,
};
export default CatchErrorAPI;
