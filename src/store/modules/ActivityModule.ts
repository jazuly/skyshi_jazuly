import ApiService from "../../core/ApiService";
import { ACTIVITY } from "../enums";
import { Action, VuexModule } from "vuex-module-decorators";
import { toastError } from "../../core/Helpers";

export default class ActivityModule extends VuexModule {
  @Action({ rawError: true })
  [ACTIVITY.GET_ALL]() {
    return new Promise<void>((resolve, reject) => {
      ApiService.query(`/activity-groups`, { params: { email: import.meta.env.VITE_EMAIL } })
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
  [ACTIVITY.GET_ONE](id: any) {
    return new Promise<void>((resolve, reject) => {
      ApiService.get(`/activity-groups`, id)
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
  [ACTIVITY.CREATE]() {
    return new Promise<void>((resolve, reject) => {
      ApiService.post(`/activity-groups`,
        {
          email: import.meta.env.VITE_EMAIL,
          title:	"New Activity"
        }
      )
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
  [ACTIVITY.UPDATE_DATA](payload: any) {
    return new Promise<void>((resolve, reject) => {
      ApiService.patch(`/activity-groups`, payload.id, payload)
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
  [ACTIVITY.DELETE_DATA](id: number) {
    return new Promise<void>((resolve, reject) => {
      ApiService.delete(`/activity-groups/${id}`)
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
