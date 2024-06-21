import { Button } from "@nextui-org/react";

const NotFoundPage = ({ message }) => {
  return (
    <div className="flex items-center flex-col">
      <h1 className="text-[20rem] text-center text-blue-500">404</h1>
      <div className="text-center text-[2rem]">{message}</div>;
      <Button color="primary" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default NotFoundPage;
