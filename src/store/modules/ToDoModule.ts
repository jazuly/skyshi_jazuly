import ApiService from "../../core/ApiService";
import { TODO } from "../enums";
import { Action, VuexModule } from "vuex-module-decorators";
import { toastError } from "../../core/Helpers";

export default class ToDoModule extends VuexModule {
  @Action({ rawError: true })
  [TODO.CREATE](payload: any) {
    return new Promise<void>((resolve, reject) => {
      ApiService.post(`/todo-items`, payload)
        .then(({ data }) => {
          return resolve(data);
        })
        .catch((err) => {
          toastError(err.message)
          return reject(err);
        });
    });
  }

  @Action({ rawError: true })
  [TODO.UPDATE_DATA](payload: any) {
    return new Promise<void>((resolve, reject) => {
      ApiService.patch(`/todo-items`, payload.id, payload)
        .then(({ data }) => {
          return resolve(data);
        })
        .catch((err) => {
          toastError(err.message)
          return reject(err);
        });
    });
  }

  @Action({ rawError: true })
  [TODO.DELETE_DATA](id: number) {
    return new Promise<void>((resolve, reject) => {
      ApiService.delete(`/todo-items/${id}`)
        .then(({ data }) => {
          return resolve(data);
        })
        .catch((err) => {
          toastError(err.message)
          return reject(err);
        });
    });
  }
}
