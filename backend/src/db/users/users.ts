import { connection } from "../connection";
import { US_STATES_ABBR_TITLE_MAP } from "./constants";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
  selectUserTemplate,
} from "./query-templates";
import { User, UserAddress } from "./types";

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<User & UserAddress>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error, results) => {
        if (error) {
          reject(error);
        }
        const formattedUsers = results.map(({ street, state, city, zipcode, ...user }) => {
          const stateTitle = US_STATES_ABBR_TITLE_MAP[state] || state;
          return ({
          ...user,
          address: `${street}, ${stateTitle}, ${city}, ${zipcode}`,
        });
        });
        resolve(formattedUsers);
      }
    );
  });


export const getUser = (id: string): Promise<User> =>
  new Promise((resolve, reject) => {
    connection.get<User & UserAddress>(selectUserTemplate, [id], (error, results) => {
      if (error || !results) {
        reject(error);
      }
      const formattedUser = {
        ...results,
        address: `${results.street}, ${results.state}, ${results.city}, ${results.zipcode}`,
      };
      resolve(formattedUser);
    });
  });