﻿module ScrumThing {
    export class Task implements ITask {
        public TaskId: number;
        public HtmlId: string;
        public Ordinal: KnockoutObservable<number> = ko.observable<number>();
        public TaskText: KnockoutObservable<string> = ko.observable<string>();
        public State: KnockoutObservable<string> = ko.observable<string>();
        public EstimatedDevHours: KnockoutObservable<number> = observableNumber();
        public EstimatedQsHours: KnockoutObservable<number> = observableNumber();
        public DevHoursBurned: KnockoutObservable<number> = observableNumber();
        public QsHoursBurned: KnockoutObservable<number> = observableNumber();
        public RemainingDevHours: KnockoutObservable<number> = observableNumber();
        public RemainingQsHours: KnockoutObservable<number> = observableNumber();
        public Assignments: KnockoutObservableArray<RawAssignment> = ko.observableArray<RawAssignment>();
        public TaskTags: KnockoutObservableArray<number> = ko.observableArray<number>();
        public Notes: KnockoutObservableArray<Note> = ko.observableArray<Note>();

        public SearchableTaskText: KnockoutComputed<string>;

        public AssignmentsForDropdown: KnockoutComputed<string[]> = ko.pureComputed<string[]>({
            read: () => {
                return _.map(this.Assignments(), (assignment) => { return assignment.UserName; });
            },
            write: (newAssignments: Array<string>) => {
                jQuery.ajax({
                    type: 'POST',
                    url: '/ViewSprint/SetAssignments',
                    data: {
                        TaskId: this.TaskId,
                        Assignments: newAssignments.join('|')
                    },
                    success: () => {
                        this.Assignments(_.map(newAssignments, (userName) => {
                            return <RawAssignment>{
                                TaskId: this.TaskId,
                                UserName: userName
                            }
                        }));
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to set assignments: " + errorThrown);
                    }
                });
            }
        }, this);

        public constructor(raw: RawTask) {
            this.TaskId = raw.TaskId;
            this.HtmlId = 'task' + raw.TaskId;
            this.Ordinal(raw.Ordinal);
            this.TaskText(raw.TaskText);
            this.State(raw.State);
            this.EstimatedDevHours(raw.EstimatedDevHours);
            this.EstimatedQsHours(raw.EstimatedQsHours);
            this.DevHoursBurned(raw.DevHoursBurned);
            this.QsHoursBurned(raw.QsHoursBurned);
            this.RemainingDevHours(raw.RemainingDevHours);
            this.RemainingQsHours(raw.RemainingQsHours);
            this.Assignments(raw.Assignments);
            this.TaskTags(_.map(raw.TaskTags, (tag) => tag.TaskTagId));
            this.Notes(_.map(raw.Notes, (raw) => new Note(raw)));
            this.TaskText.subscribe(this.UpdateTask);
            this.State.subscribe(this.UpdateTask);
            this.EstimatedDevHours.subscribe(this.UpdateTask);
            this.EstimatedQsHours.subscribe(this.UpdateTask);
            this.DevHoursBurned.subscribe(this.UpdateTask);
            this.QsHoursBurned.subscribe(this.UpdateTask);
            this.RemainingDevHours.subscribe(this.UpdateTask);
            this.RemainingQsHours.subscribe(this.UpdateTask);

            this.SearchableTaskText = ko.computed(() => {
                return this.TaskText().toLowerCase();
            });
        }

        public UpdateTask = () => {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/UpdateTask',
                data: {
                    LoggedBy: ScrumThing.Globals.CurrentUserIdentity,
                    TaskId: this.TaskId,
                    TaskText: this.TaskText(),
                    State: this.State,
                    EstimatedDevHours: this.EstimatedDevHours,
                    EstimatedQsHours: this.EstimatedQsHours,
                    DevHoursBurned: this.DevHoursBurned,
                    QsHoursBurned: this.QsHoursBurned,
                    RemainingDevHours: this.RemainingDevHours,
                    RemainingQsHours: this.RemainingQsHours,
                    TaskTags: this.TaskTags().join('|')
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to update task: " + errorThrown);
                }
            });
        }

        public HasTaskTag(taskTagId: number) {
            return _.contains(this.TaskTags(), taskTagId);
        }

        public ToggleTaskTag(taskTagId: number) {
            return () => {
                if (this.HasTaskTag(taskTagId)) {
                    this.TaskTags.remove(taskTagId);
                } else {
                    this.TaskTags.push(taskTagId);
                }

                this.UpdateTask();
                return true;
            };
        }
    }
} 
