import React from "react";
import {AsyncStorage,Alert} from "react-native";
import {info_api} from "../api/Variables";
import NavigationService from "../components/NavigationService";



class CheckUser{}



    CheckUser.checarUsuario = function() {

        let code = "";
        let active = "";

        try {


            AsyncStorage.getItem("User")
                .then(username => {


                        if (username.toString() !== "") {
                           // console.warn(username.toString());
                            fetch(info_api.url + "usuarios/find_by_user?username=" + username.toString(),
                                {
                                    headers: {
                                        "Natura-Api-Key": info_api.api_key
                                    }
                                }
                            )
                                .then(res => res.json())
                                .then(response => {
                                    code = response.code.toString();

                                    switch (code) {
                                        case "200":
                                            active = response.usuario.activo.toString();



                                            if (active.toString() === "true") {

                                                AsyncStorage.setItem("usrID", response.usuario.id.toString());
                                                AsyncStorage.setItem("User", response.usuario.username.toString());
                                                AsyncStorage.setItem("typePlan", response.usuario.tipo_plan.toString());

                                                return true;

                                            } else {

                                                AsyncStorage.setItem("User", "");
                                                AsyncStorage.setItem("usrID", "");
                                                AsyncStorage.setItem("typePlan", "");
                                                AsyncStorage.setItem("session", "false");
                                                AsyncStorage.setItem("@MyStore:bookmarks", "");
                                                AsyncStorage.setItem("active", "false");
                                                Alert.alert("", "El usuario ha sido deshabilitado");
                                                NavigationService.navigate("Login");
                                                return false;
                                            }
                                            break;
                                        default:
                                            AsyncStorage.setItem("User", "");
                                            AsyncStorage.setItem("usrID", "");
                                            AsyncStorage.setItem("typePlan", "");
                                            AsyncStorage.setItem("session", "false");
                                            AsyncStorage.setItem("@MyStore:bookmarks", "");
                                            AsyncStorage.setItem("active", "false");
                                            Alert.alert("", "El usuario ha sido deshabilitado");
                                            NavigationService.navigate("Login");
                                            return false;
                                            break;
                                    }
                                }).catch(error => alert(error))
                                .done();
                        } else {
                            AsyncStorage.setItem("User", "");
                            AsyncStorage.setItem("usrID", "");
                            AsyncStorage.setItem("typePlan", "");
                            AsyncStorage.setItem("session", "false");
                            AsyncStorage.setItem("@MyStore:bookmarks", "");
                            AsyncStorage.setItem("active", "false");
                            Alert.alert("", "El usuario ha sido deshabilitado");
                            NavigationService.navigate("Login");

                            return false;
                        }
                    }
                );

        } catch (e) {
            console.log("Ha ocurrido un error", e);
        }

    }

module.exports = {

    functions: CheckUser
}













