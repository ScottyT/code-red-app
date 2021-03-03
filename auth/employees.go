package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

/* type Employee struct {
	ID    string `firestore:"id"`
	Email string `firestore:"email"`
	Name  string `firestore:"name"`
}
type Employees struct {
	Employees []Employee `json:"employee"`
}

var empl Employee
var emps Employees
*/
//var employees []Employee
func getEmp(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client := createClient(ctx)
	defer client.Close()

	emp, err := client.Collection("employees").Documents(ctx).GetAll()
	if err != nil {
		log.Println("Error getting employees:", err)
	}
	fmt.Println("emp:", emp)
	arr := []map[string]interface{}{}
	for _, doc := range emp {
		arr = append(arr, doc.Data())
	}
	json.NewEncoder(w).Encode(arr)
}
