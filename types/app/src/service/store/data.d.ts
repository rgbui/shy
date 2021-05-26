export declare var data: {
    url: string;
    views: {
        url: string;
        blocks: {
            childs: ({
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        content: string;
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        blocks: {
                            childs: {
                                url: string;
                                content: string;
                            }[];
                        };
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        content: string;
                        checked: boolean;
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        widthPercent: number;
                        src: string;
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        cols: {
                            name: string;
                            width: number;
                        }[];
                        meta: {
                            cols: {
                                name: string;
                                text: string;
                                type: string;
                            }[];
                        };
                        data: {
                            s1: string;
                            s2: number;
                        }[];
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        formula: string;
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        cols: {
                            width: number;
                        }[];
                        blocks: {
                            childs: {
                                url: string;
                                blocks: {
                                    childs: ({
                                        url: string;
                                        blocks: {
                                            childs: {
                                                url: string;
                                                blocks: {
                                                    childs: {
                                                        url: string;
                                                        content: string;
                                                    }[];
                                                };
                                            }[];
                                        };
                                        colspan?: undefined;
                                    } | {
                                        url: string;
                                        blocks: {
                                            childs: {
                                                url: string;
                                                blocks: {
                                                    childs: {
                                                        url: string;
                                                        content: string;
                                                    }[];
                                                };
                                            }[];
                                        };
                                        colspan: number;
                                    })[];
                                };
                            }[];
                        };
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        code: string;
                    }[];
                };
            } | {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        blocks: {
                            childs: {
                                url: string;
                                content: string;
                            }[];
                            subChilds: {
                                url: string;
                                blocks: {
                                    childs: {
                                        url: string;
                                        blocks: {
                                            childs: {
                                                url: string;
                                                content: string;
                                            }[];
                                        };
                                    }[];
                                };
                            }[];
                        };
                    }[];
                };
            })[];
        };
    }[];
};
export declare var defaultPageData: {
    url: string;
    views: {
        url: string;
        blocks: {
            childs: {
                url: string;
                blocks: {
                    childs: {
                        url: string;
                        content: string;
                    }[];
                };
            }[];
        };
    }[];
};
export declare var workspaceDefaultData: {
    profile_photo: string;
    title: string;
    modules: {
        text: string;
        type: string;
        items: {
            id: string;
            text: string;
            mime: number;
        }[];
    }[];
};
