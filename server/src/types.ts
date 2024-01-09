import http from "http";
import { ParsedUrlQuery } from "querystring";

export type Controller = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  query: ParsedUrlQuery;
};
