﻿/// <reference path='../../Scripts/typings/underscore/underscore.d.ts' />
/// <reference path='../Shared/Utility.ts' />

jQuery(function () {
    var viewModel: Scrum.ViewSprintViewModel = new Scrum.ViewSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    (<any>window).viewModel = viewModel;
});

module Scrum {
    export class ViewSprintViewModel extends BaseSprintViewModel {
        public currentTask: KnockoutObservable<Task> = ko.observable<Task>(null);

        public newNote: KnockoutObservable<string> = ko.observable<string>();

        public states: string[] = [
            'Blocked',
            'ReadyForDev',
            'DevInProgress',
            'ReadyForQs',
            'QsInProgress',
            'Complete'
        ];

        constructor() {
            super();

            // TODO: Move this to a custom binding
            this.currentTask.subscribe(() => {
                jQuery("#taskDetails").modal();
            });
        }

        public GetStoryTasksInState(story: Story, state: string): KnockoutComputed<Task[]> {
            return ko.computed(() => {
                return _.sortBy(_.filter(story.Tasks(), (task) => { return task.State() == state; }), (task) => task.Ordinal());
            });
        }

        public Drag(event: any) {
            event.dataTransfer.setData('text', event.target.id);
        }

        public AllowDrop(event: any) {
            event.preventDefault();
        }

        public DropTask(event: any, state: string) {
            var htmlId = event.dataTransfer.getData('text');
            var task = _.find(this.tasks(), (t) => { return t.HtmlId == htmlId; });
            task.State(state);
        }

        public SetTask(task: Task) {
            return () => {
                this.currentTask(task);
            }
        }

        public OnDropTask(state: { State: string }) {
            return "viewModel.DropTask(event, '" + state.State + "')";
        }

        public ClassForTask(task: Task) {
            return ko.computed(() => {
                if (this.currentTask() != null && task.TaskId == this.currentTask().TaskId) {
                    return "active";
                }

                if (task.State() == "Blocked") {
                    return "list-group-item-danger";
                }

                return "";
            });
        }

        public ClassForAssignment(task: Task, username: string) {
            var assigned = _.any(task.Assignments(), (assignment) => { return assignment.UserName == username; });
            if (assigned) {
                return "btn-primary";
            }
            return "btn-default";
        }

        public AddNote() {
            jQuery.ajax({
                type: 'POST',
                url: '/ViewSprint/AddNote',
                data: {
                    TaskId: this.currentTask().TaskId,
                    Note: this.newNote()
                },
                success: (data: RawNote) => {
                    this.newNote('');
                    this.currentTask().Notes.unshift(data);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to add note: " + errorThrown);
                }
            });
        }

        public MakeSetCollapsedHandler(story: Story, collapsed: boolean) {
            return () => {
                this.SetCollapsed(story, collapsed);
            };
        }

        public SetCollapsed(story: Story, collapsed: boolean) {
            localStorage.setItem('collapsed' + story.StoryId, JSON.stringify(collapsed));
            story.CollapsedOverride(collapsed);
        }

        public ExpandAll() {
            _.forEach(this.stories(), (story) => {
                this.SetCollapsed(story, false);
            });
        }

        public CollapseAll() {
            _.forEach(this.stories(), (story) => {
                this.SetCollapsed(story, true);
            });
        }

        public SmartCollapse() {
            Object.keys(localStorage)
                .forEach((key) => {
                    if (/^collapsed/.test(key)) {
                        localStorage.removeItem(key);
                    }
                });
            _.forEach(this.stories(), (story) => {
                story.CollapsedOverride(null);
            });
        }
    }
}
