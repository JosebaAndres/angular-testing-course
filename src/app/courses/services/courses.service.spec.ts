import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returns");
      expect(courses.length).toBe(12, "incorrect number of courses");
      const course = courses.find((course) => course.id === 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");

    req.flush({
      payload: Object.values(COURSES),
    });
  });

  it("should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({ ...COURSES[12], ...changes });
  });

  it("should give an error if save course fails", () => {
    const changes = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => {
        fail("the save course operation should have failed");
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    req.flush("Save course failed", {
      status: 500,
      statusText: "Internal server error",
    });
  });

  it("should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req) => req.url === "/api/lessons"
    );

    expect(req.request.method).toBe("GET");
    expect(req.request.params.get("courseId")).toBe("12");
    expect(req.request.params.get("filter")).toBe("");
    expect(req.request.params.get("sortOrder")).toBe("asc");
    expect(req.request.params.get("pageNumber")).toBe("0");
    expect(req.request.params.get("pageSize")).toBe("3");

    req.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});