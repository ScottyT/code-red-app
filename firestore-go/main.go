package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/rs/cors"
)

type Report struct {
	JobId      string `json:"JobId"`
	ReportType string `json:"ReportType"`
}
type By func(r1, r2 *Report) bool
type reportSorter struct {
	by      By
	Option  string   `json:"option"`
	Reports []Report `json:"report"`
}

func (by By) Sort(report []Report) {
	rs := &reportSorter{
		by:      by,
		Reports: report,
	}
	sort.Sort(rs)
}

func (s *reportSorter) Len() int {
	return len(s.Reports)
}
func (s *reportSorter) Swap(i, j int) {
	s.Reports[i], s.Reports[j] = s.Reports[j], s.Reports[i]
}
func (s *reportSorter) Less(i, j int) bool {
	return s.by(&s.Reports[i], &s.Reports[j])
}

func createClient(ctx context.Context) *firestore.Client {
	//sa := option.WithCredentialsFile("/tmp/keys/keyfile.json")
	/* conf := &firebase.Config{ProjectID: "wesi-form"}
	app, err := firebase.NewApp(ctx, conf, nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	} */

	client, err := firestore.NewClient(ctx, "wesi-form")
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	return client
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client := createClient(ctx)
	defer client.Close()

	reqBody, _ := ioutil.ReadAll(r.Body)
	doc := make(map[string]interface{})

	// if err := json.Unmarshal(reqBody, &newValues); err != nil {
	// 	panic(err)
	// }
	if err := json.Unmarshal(reqBody, &doc); err != nil {
		fmt.Println("Error unmarshalling: ", err)
	}
	for key, value := range doc {
		if value == "" || value == nil {
			fmt.Println("Empty Value: ", key)
			doc[key] = "N/A"
		}
	}

	if doc["ReportType"] == "rapid-response" {
		_, err := client.Collection("rapid-response-reports").Doc(doc["JobId"].(string)).Set(ctx, doc)
		if err != nil {
			fmt.Fprintf(w, "Error happended adding data: %v", err)
		}
		fmt.Fprintln(w, "You have successfully submitted a rapid response report!")
	}
	if doc["ReportType"] == "dispatch" {
		_, err := client.Collection("dispatch-reports").Doc(doc["JobId"].(string)).Set(ctx, doc)
		if err != nil {
			fmt.Fprintf(w, "An error has occurred: %v", err)
		}
		fmt.Fprintln(w, "You have successfully submitted a dispatch report!")
	}
	messages := make(chan int)
	go func() {
		time.Sleep(time.Second * 3)
		messages <- 1
	}()
	go func() {
		time.Sleep(time.Second * 2)
		messages <- 2
	}()
	go func() {
		time.Sleep(time.Second * 1)
		messages <- 3
	}()
	go func() {
		for i := range messages {
			fmt.Println(i)
		}
	}()
	time.Sleep(time.Second * 3)
}

func sorting(w http.ResponseWriter, r *http.Request) {
	var data reportSorter
	reqBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal([]byte(reqBody), &data)
	idasc := func(r1, r2 *Report) bool {
		return r1.JobId < r2.JobId
	}
	iddesc := func(r1, r2 *Report) bool {
		return r1.JobId > r2.JobId
	}

	switch {
	case data.Option == "idAsc":
		By(idasc).Sort(data.Reports)
	case data.Option == "idDesc":
		By(iddesc).Sort(data.Reports)
	}
	json.NewEncoder(w).Encode(data)
}
func downloadFile(w io.Writer, r io.Reader) {
	//bucket := "wesi-form.appspot.com"
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatal("storage error", err)
	}
	defer client.Close()
	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()
	item := make(map[string]interface{})
	reqBody, _ := ioutil.ReadAll(r)
	json.Unmarshal([]byte(reqBody), &item)
	fmt.Println(item)

	/* rc, err := client.Bucket(bucket).Object(object).NewReader(ctx)
	if err != nil {
		log.Fatal("object reader error", err)
	}
	data, err := ioutil.ReadAll(rc)
	if err != nil {
		log.Fatal("ioutil error", err)
	}
	fmt.Fprintf(w, "Blob %v downloaded.\n", object)
	fmt.Println("data:", data) */
}

// FileServer
func FileServer(router *chi.Mux) {
	root := "./dist"
	fs := http.FileServer(http.Dir(root))
	fmt.Println("Localhost starting on :8080")
	router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		if _, err := os.Stat(root + r.RequestURI); os.IsNotExist(err) {
			http.StripPrefix(r.RequestURI, fs).ServeHTTP(w, r)
		} else {
			fs.ServeHTTP(w, r)
		}
	})
}

/* func enableCors(w *http.ResponseWriter, r *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
} */

func main() {
	/* audience := "wesi-form@appspot.gserviceaccount.com"
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	// Create token
	ts, err := idtoken.NewTokenSource(ctx, audience)
	if err != nil {
		log.Fatal("idtoken.NewTokenSource:", err)
	}
	token, err := ts.Token()
	fmt.Println("main token:", token)
	if err != nil {
		log.Fatal("TokenSource.Token:", err)
	}
	req, err := http.NewRequest(http.MethodGet, audience, nil)
	if err != nil {
		log.Fatal("RenderService.NewRequest:", err)
	}
	token.SetAuthHeader(req)
	fmt.Println("main req:", req.Header) */
	/* ctx := context.Background()
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error initializing client: %v\n", err)
	}
	token, err := client.CustomToken(ctx, "wesi-token")
	if err != nil {
		log.Fatalf("error minting custom token: %v\n", err)
	}
	decoded, err := client.VerifyIDToken(ctx, token)
	if err != nil {
		log.Fatalf("error verifying token: %v\n", err)
	}
	uid := decoded.UID
	fmt.Println("uid:", uid)
	if uid == "" {
		return
	} */
	c := cors.New(cors.Options{
		AllowedOrigins:     []string{"*"},
		AllowedMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:     []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "X-PINGOTHER"},
		OptionsPassthrough: true,
		Debug:              true,
	})

	router := chi.NewRouter()
	router.Use(c.Handler)
	router.Use(middleware.RequestID)

	server := &http.Server{
		Addr:         ":8080",
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	/* router.Route("/all-reports", func(router chi.Router) {
		router.Get("/", reportsList)
		router.Get("/{reportType}/{reportId}", getReport)
		//router.Get("/{reportId}", downloadFiles)
		// router.Route("", func(router chi.Router) {

		// })
	}) */
	//router.Get("/employees", getEmp)
	//http.ListenAndServe(":8080", router)
	//router.Post("/upload", uploadHandler)
	FileServer(router)
	panic(server.ListenAndServe())
}
